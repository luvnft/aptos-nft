import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { IpfsImage } from "@/components/IpfsImage";
import { PageTitle } from "@/components/PageTitle";
import { NFT, useGetOwnedNFTs } from "@/hooks/useGetOwnedNFTs";
import { useEffect, useState } from "react";

export function EvolveNFT() {
  const { data, isLoading, isPending } = useGetOwnedNFTs();
  const [evolvableNFTs, setEvolvableNFTs] = useState<NFT[]>();

  useEffect(() => {
    // get evolvable NFTs
    setEvolvableNFTs([]);
  }, [data]);

  return (
    <>
      <Header />

      <Container>
        <PageTitle text={<>Evolve Your NFTs</>} />
        {isLoading || isPending || !evolvableNFTs ? (
          <div className="">Loading...</div>
        ) : evolvableNFTs.length === 0 ? (
          <div className="">No Evolvable NFTs found</div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {evolvableNFTs.map((nft) => {
              return (
                <div key={nft.id}>
                  <div className={`relative p-2 border `}>
                    <div className={`w-full h-full object-cover `}>
                      <IpfsImage ipfsUri={nft.image} />
                    </div>
                  </div>
                  <p className={`text-center pt-2 `}>{nft.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}
