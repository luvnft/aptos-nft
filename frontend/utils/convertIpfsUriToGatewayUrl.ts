export function convertIpfsUriToGatewayUrl(ipfsUri: string, gateway: string = "https://ipfs.io/ipfs/") {
  const cid = ipfsUri.replace("ipfs://", "");
  return `${gateway}${cid}`;
}
