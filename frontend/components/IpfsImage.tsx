import { convertIpfsUriToGatewayUrl } from "@/utils/convertIpfsUriToGatewayUrl";
import { useEffect, useState } from "react";
import axios from "axios";
import { Image } from "@/components/ui/image";

interface IpfsImageProps {
  ipfsUri: string;
}

// List of IPFS gateways to use as fallbacks
const gateways = [
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://infura-ipfs.io/ipfs/",
  "https://dweb.link/ipfs/",
];

export const IpfsImage: React.FC<IpfsImageProps> = ({ ipfsUri }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      for (const gateway of gateways) {
        try {
          // Convert the IPFS URI to a Gateway URL for the JSON
          const gatewayUrl = convertIpfsUriToGatewayUrl(ipfsUri, gateway);

          // Fetch the JSON content from IPFS
          const response = await axios.get(gatewayUrl);
          const jsonData = response.data;

          // Extract the IPFS URI for the image
          const imageIpfsUri = jsonData.image;

          // Convert the Image IPFS URI to a Gateway URL
          const imageGatewayUrl = convertIpfsUriToGatewayUrl(imageIpfsUri, gateway);

          // Set the image URL to be displayed
          setImageUrl(imageGatewayUrl);
          break; // Stop once we successfully fetch the image
        } catch (error) {
          console.error(`Error fetching from gateway ${gateway}:`, error);
          continue; // Try the next gateway if the current one fails
        }
      }
    };

    fetchImage();
  }, [ipfsUri]);

  return <div>{imageUrl ? <Image src={imageUrl} rounded className="w-10 h-10 bg-gray-100 shrink-0" /> : null}</div>;
};
