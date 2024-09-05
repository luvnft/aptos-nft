import { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";
import { ipfs } from "@/utils/assetsUploader";
import { convertIpfsUriToCid } from "@/utils/convertIpfsUriToCid";

interface IpfsImageProps {
  ipfsUri: string;
}

export const IpfsImage: React.FC<IpfsImageProps> = ({ ipfsUri }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Retrieve the image from IPFS
        const stream = ipfs.cat(convertIpfsUriToCid(ipfsUri));

        // Convert stream to a Blob
        const chunks: Uint8Array[] = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }

        // Create a Blob from the chunks
        const blob = new Blob(chunks, { type: "image/png" }); // Assuming the image type is PNG, adjust if necessary

        // Convert Blob to a Data URL
        const imageUrl = URL.createObjectURL(blob);

        // Set the image source
        setImageSrc(imageUrl);
      } catch (error) {
        console.error(`Error fetching from ${ipfsUri}:`, error);
      }
    };

    fetchImage();
  }, [ipfsUri]);

  return <div>{imageSrc ? <Image src={imageSrc} rounded className="w-10 h-10 bg-gray-100 shrink-0" /> : null}</div>;
};
