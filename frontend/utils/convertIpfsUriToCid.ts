export function convertIpfsUriToCid(ipfsUri: string) {
  return ipfsUri.replace("ipfs://", "");
}
