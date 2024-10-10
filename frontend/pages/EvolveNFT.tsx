import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { IpfsImage } from "@/components/IpfsImage";
import { PageTitle } from "@/components/PageTitle";
import { useGetEvolutionRules } from "@/hooks/useGetEvolutionRules";
import { NFT } from "@/hooks/useGetOwnedNFTs";
import { CollectionWithNFTs, useGetOwnedNFTsByCollection } from "@/hooks/useGetOwnedNFTsByCollection";
import { useMemo } from "react";

export function EvolveNFT() {
  const { data, isLoading } = useGetOwnedNFTsByCollection();

  return (
    <>
      <Header />

      <Container>
        <PageTitle text={<>Evolve Your NFTs</>} />
        {isLoading || !data ? (
          <div className="">Loading...</div>
        ) : data.length === 0 ? (
          <div className="">No NFTs found</div>
        ) : (
          <div className="">
            {data.map((collection) => {
              return <NFTCollection key={collection.collection_id} collection={collection} />;
            })}
          </div>
        )}
      </Container>
    </>
  );
}

const NFTCollection = ({ collection }: { collection: CollectionWithNFTs }) => {
  const { data: rules, isLoading } = useGetEvolutionRules(collection.collection_id);

  const evolvableNFTs = useMemo(() => {
    if (!rules) return undefined;

    return collection.nfts.filter((nft) => rules.some((rule) => rule.mainToken === nft.name));
  }, [collection.nfts, rules]);

  return (
    <div className="mb-8 pb-8 border-b border-b-gray-400">
      <p className="text-2xl font-semibold mb-4">{collection.collection_name}</p>
      {isLoading || !evolvableNFTs ? (
        <div className="">Loading...</div>
      ) : evolvableNFTs.length === 0 ? (
        <div className="">No Evolvable NFTs found</div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {evolvableNFTs.map((nft) => {
            return <NFTItem key={nft.id} nft={nft} />;
          })}
        </div>
      )}
    </div>
  );
};

const NFTItem = ({ nft }: { nft: NFT }) => {
  return (
    <div>
      <div className={`relative p-2 border `}>
        <div className={`w-full h-full object-cover `}>
          <IpfsImage ipfsUri={nft.image} />
        </div>
      </div>
      <p className={`text-center pt-2 `}>{nft.name}</p>
    </div>
  );
};
