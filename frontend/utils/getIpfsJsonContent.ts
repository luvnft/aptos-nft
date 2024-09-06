import { ipfs } from "./assetsUploader";
import { convertIpfsUriToCid } from "./convertIpfsUriToCid";

export const getIpfsJsonContent = async (uri: string) => {
  const cid = convertIpfsUriToCid(uri);
  const stream = ipfs.cat(cid);

  // Create an array to collect the chunks of data
  const chunks: Uint8Array[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  // Concatenate all chunks into a single Uint8Array
  const contentBytes = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    contentBytes.set(chunk, offset);
    offset += chunk.length;
  }

  // Try to decode the content as JSON
  const contentText = new TextDecoder().decode(contentBytes);
  const parsedJson = JSON.parse(contentText);

  return parsedJson;
};
