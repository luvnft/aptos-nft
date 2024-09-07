import { create } from "ipfs-http-client";
import { ImportCandidate } from "node_modules/ipfs-core-types/dist/src/utils";

const projectId = "2Xi31agz7M8y7BuefMlhbswjv3L";
const projectSecret = "1d72178ee211645564992adfd6ddc6f2";

// Configure the IPFS client
export const ipfs = create({
  host: "ipfs.infura.io", // You can use Infura or your own IPFS node
  port: 5001,
  protocol: "https",
  headers: {
    authorization: "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64"),
  },
});

const VALID_MEDIA_EXTENSIONS = ["png", "jpg", "jpeg", "gltf"];
export type CollectionMetadata = {
  name: string;
  description: string;
  image: string;
  external_url: string;
};
type ImageAttribute = {
  trait_type: string;
  value: string;
};
type ImageCombination = {
  [key: string]: string;
};
export type ImageMetadata = {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: ImageAttribute[];
  combinations: ImageCombination;
};

export const uploadCollectionData = async (
  // aptosWallet: any,
  fileList: FileList,
): Promise<{
  collectionName: string;
  collectionDescription: string;
  maxSupply: number;
  projectUri: string;
}> => {
  const files: File[] = [];
  for (let i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }

  const collectionFiles = files.filter((file) => file.name.includes("collection"));
  if (collectionFiles.length !== 2) {
    throw new Error("Please make sure you include both collection.json and collection image file");
  }

  const collectionMetadataFile = collectionFiles.find((file) => file.name === "collection.json");
  if (!collectionMetadataFile) {
    throw new Error("Collection metadata not found, please make sure you include collection.json file");
  }

  const collectionCover = collectionFiles.find((file) =>
    VALID_MEDIA_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`)),
  );
  if (!collectionCover) {
    throw new Error("Collection cover not found, please make sure you include the collection image file");
  }

  const mediaExt = collectionCover.name.split(".").pop();
  // Sort and validate nftImageMetadatas to ensure filenames are sequential
  const nftImageMetadatas = files
    .filter(
      (file) =>
        file.name.endsWith("json") &&
        file.name !== "collection.json" &&
        !file.name.toLowerCase().includes("combination"), // Exclude combination files
    )
    .sort((a, b) => {
      const getFileNumber = (file: File) => parseInt(file.name.replace(".json", ""), 10);

      const numA = getFileNumber(a);
      const numB = getFileNumber(b);

      return numA - numB; // Sort by the numeric part of the filenames
    });
  if (nftImageMetadatas.length === 0) {
    throw new Error("Image metadata not found, please make sure you include the NFT json files");
  }
  // Validate that nftImageMetadatas filenames start from 1 and are sequential
  nftImageMetadatas.forEach((file, index) => {
    const fileNumber = parseInt(file.name.replace(".json", ""), 10);
    if (fileNumber !== index + 1) {
      throw new Error(`Filenames are not sequential. Expected ${index + 1}.json but found ${file.name}`);
    }
  });

  const imageFiles = files
    .filter(
      (file) =>
        file.name.endsWith(`.${mediaExt}`) &&
        file.name !== collectionCover.name &&
        !file.name.toLowerCase().includes("combination"), // Exclude combination files
    )
    .sort((a, b) => {
      const getFileNumber = (file: File) => parseInt(file.name.replace(`.${mediaExt}`, ""), 10);

      const numA = getFileNumber(a);
      const numB = getFileNumber(b);

      return numA - numB; // Sort by the numeric part of the filenames
    });
  if (imageFiles.length === 0) {
    throw new Error("Image files not found, please make sure you include the NFT image files");
  }
  if (nftImageMetadatas.length !== imageFiles.length) {
    throw new Error("Mismatch between NFT metadata json files and images files");
  }
  // Validate that imageFiles filenames start from 1 and are sequential
  imageFiles.forEach((file, index) => {
    const fileNumber = parseInt(file.name.replace(`.${mediaExt}`, ""), 10);
    if (fileNumber !== index + 1) {
      throw new Error(`Image filenames are not sequential. Expected ${index + 1}.${mediaExt} but found ${file.name}`);
    }
  });

  // Handle combination files (combination1.json, combination2.json, etc.)
  const combinationMetadatas = files
    .filter((file) => file.name.endsWith("json") && file.name.includes("combination"))
    .sort((a, b) => {
      const getCombinationNumber = (file: File) =>
        parseInt(file.name.replace("combination", "").replace(".json", ""), 10);

      const numA = getCombinationNumber(a);
      const numB = getCombinationNumber(b);

      return numA - numB; // Sort by the numeric part of the combination filenames
    });

  const combinationImageFiles = files
    .filter((file) => file.name.endsWith(`.${mediaExt}`) && file.name.includes("combination"))
    .sort((a, b) => {
      const getCombinationNumber = (file: File) =>
        parseInt(file.name.replace("combination", "").replace(`.${mediaExt}`, ""), 10);

      const numA = getCombinationNumber(a);
      const numB = getCombinationNumber(b);

      return numA - numB; // Sort by the numeric part of the combination filenames
    });

  if (combinationMetadatas.length !== combinationImageFiles.length) {
    throw new Error("Mismatch between combination metadata json files and images files");
  }

  // Validate combination filenames
  combinationMetadatas.forEach((file, index) => {
    const fileNumber = parseInt(file.name.replace("combination", "").replace(".json", ""), 10);
    if (fileNumber !== index + 1) {
      throw new Error(
        `Combination filenames are not sequential. Expected combination${index + 1}.json but found ${file.name}`,
      );
    }
  });

  // Upload images and metadata to IPFS
  // const ipfsUploads: { path: string; cid: string }[] = [];
  const uploadFileToIpfs = async (file: File, path?: string) => {
    const added = await ipfs.add(path ? { path, content: file } : file);
    return added.cid.toString();
  };

  const filesToUpload: ImportCandidate[] = [];

  const imageFolderCid = await uploadFileToIpfs(collectionCover);

  const updatedCollectionMetadata: CollectionMetadata = JSON.parse(await collectionMetadataFile.text());
  updatedCollectionMetadata.image = `ipfs://${imageFolderCid}`;

  // Step 1: Upload combination files and store their CIDs
  const combinationCidMap: ImageCombination = {};

  await Promise.all(
    combinationMetadatas.map(async (metadataFile, index) => {
      const metadata: ImageMetadata = JSON.parse(await metadataFile.text());
      const combinationImageFile = combinationImageFiles[index];

      // Upload combination image file
      const imageCid = await uploadFileToIpfs(combinationImageFile);
      metadata.image = `ipfs://${imageCid}`;

      // Upload combination metadata file
      const updatedMetadataFile = new File([JSON.stringify(metadata)], `combination${index + 1}.json`, {
        type: metadataFile.type,
      });
      const combinationCid = await uploadFileToIpfs(updatedMetadataFile);
      combinationCidMap[metadata.name] = combinationCid;

      filesToUpload.push({ path: `combination${index + 1}.json`, content: updatedMetadataFile });
    }),
  );

  // Step 2: Upload main image files and corresponding metadata files
  await Promise.all(
    nftImageMetadatas.map(async (metadataFile, index) => {
      const metadata: ImageMetadata = JSON.parse(await metadataFile.text());
      const imageFile = imageFiles[index];

      // Upload image file
      const imageCid = await uploadFileToIpfs(imageFile);
      metadata.image = `ipfs://${imageCid}`;

      // Check for combinations and match the combination metadata with the uploaded combination CID
      if (metadata.combinations) {
        Object.keys(metadata.combinations).forEach((combinationKey) => {
          if (combinationCidMap[combinationKey]) {
            metadata.combinations[combinationKey] = `ipfs://${combinationCidMap[combinationKey]}`;
          }
        });
      }

      // Create updated metadata file
      const updatedMetadataFile = new File([JSON.stringify(metadata)], `${index + 1}.json`, {
        type: metadataFile.type,
      });
      filesToUpload.push({ path: `${index + 1}.json`, content: updatedMetadataFile });
    }),
  );

  // Step 3: Add the collection.json file to the filesToUpload list
  const updatedCollectionFile = new File([JSON.stringify(updatedCollectionMetadata)], "collection.json", {
    type: collectionMetadataFile.type,
  });
  filesToUpload.push({ path: "collection.json", content: updatedCollectionFile });

  // Step 4: Upload all files in a single request to IPFS
  let folderCid = "";

  for await (const result of ipfs.addAll(filesToUpload, { wrapWithDirectory: true })) {
    folderCid = result.cid.toString(); // Store the final folder CID
  }

  return {
    projectUri: `ipfs://${folderCid}/collection.json`,
    maxSupply: imageFiles.length,
    collectionName: updatedCollectionMetadata.name,
    collectionDescription: updatedCollectionMetadata.description,
  };
};
