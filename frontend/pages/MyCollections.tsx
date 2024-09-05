import { Link } from "react-router-dom";
import { GetCollectionDataResponse } from "@aptos-labs/ts-sdk";
// Internal components
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
// Internal hooks
import { useGetCollections } from "@/hooks/useGetCollections";
// Internal constants
import { NETWORK } from "@/constants";
import { IpfsImage } from "@/components/IpfsImage";
import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { LabeledInput } from "@/components/ui/labeled-input";
import { Button } from "@/components/ui/button";
import { mintNFT } from "@/entry-functions/mint_nft";
import { aptosClient } from "@/utils/aptosClient";
import { convertIpfsUriToCid } from "@/utils/convertIpfsUriToCid";
import { CollectionMetadata, ipfs } from "@/utils/assetsUploader";

export function MyCollections() {
  const collections: Array<GetCollectionDataResponse> = useGetCollections();

  return (
    <>
      <LaunchpadHeader title="My Collections" />
      <Table className="max-w-screen-xl mx-auto">
        {!collections.length && (
          <TableCaption>A list of the collections created under the current contract.</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>Collection</TableHead>
            <TableHead>Collection Address</TableHead>
            <TableHead>Minted NFTs</TableHead>
            <TableHead>Max Supply</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.length > 0 &&
            collections.map((collection) => {
              return <CollectionRow key={collection?.collection_id} collection={collection} />;
            })}
        </TableBody>
      </Table>
    </>
  );
}

interface CollectionRowProps {
  collection: GetCollectionDataResponse;
}

const CollectionRow = ({ collection }: CollectionRowProps) => {
  const { account, signAndSubmitTransaction } = useWallet();

  // collection metadata
  const [metadata, setMetadata] = useState<CollectionMetadata>();
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const cid = convertIpfsUriToCid(collection.uri);
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
        setMetadata(parsedJson);
      } catch (error) {
        console.error("Error fetching content from IPFS:", error);
      }
    };

    fetchContent();
  }, [collection]);

  const [isUploading, setIsUploading] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  const [mintAmount, setMintAmount] = useState<number>();

  const onClickRow = () => {
    setIsTransactionFormOpen((state) => !state);
  };

  const mintNft = async () => {
    try {
      if (!account) throw new Error("Please connect your wallet");
      if (!mintAmount) throw new Error("Please set the amount");
      if (isUploading) throw new Error("Uploading in progress");
      setIsUploading(true);

      // Submit a mint_nft entry function transaction
      const response = await signAndSubmitTransaction(
        mintNFT({
          tokenName: "",
          collectionId: collection.collection_id,
          amount: mintAmount,
        }),
      );

      // Wait for the transaction to be commited to chain
      await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });
    } catch (error) {
      alert(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <TableRow
        key={collection?.collection_id}
        onClick={onClickRow}
        className={`${isTransactionFormOpen ? "border-0" : ""} cursor-pointer`}
      >
        <TableCell className="font-medium">
          <div className="flex items-center gap-2 flex-wrap">
            {metadata && <IpfsImage ipfsUri={metadata.image} />}
            <span>{collection?.collection_name}</span>
          </div>
        </TableCell>
        <TableCell>
          <Link
            to={`https://explorer.aptoslabs.com/object/${collection?.collection_id}?network=${NETWORK}`}
            target="_blank"
            style={{ textDecoration: "underline" }}
          >
            {collection?.collection_id}
          </Link>
        </TableCell>
        <TableCell>{collection?.total_minted_v2}</TableCell>
        <TableCell>{collection?.max_supply}</TableCell>
      </TableRow>
      {isTransactionFormOpen && (
        <TableRow className="hover:bg-inherit">
          <TableCell>
            <LabeledInput
              id={`${collection.collection_id}-mint-amount`}
              required
              label="Mint amount"
              tooltip="How many NFTs you want to mint for this collection."
              disabled={isUploading || !account}
              onChange={(e) => {
                setMintAmount(parseInt(e.target.value));
              }}
            />
          </TableCell>
          <TableCell className="align-bottom">
            <Button variant="green" onClick={mintNft} disabled={isUploading || !account || !mintAmount}>
              Execute
            </Button>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
