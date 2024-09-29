import { IpfsImage } from "@/components/IpfsImage";
import { Header } from "@/components/Header";
import { useGetOwnedNFTs } from "@/hooks/useGetOwnedNFTs";
import { PageTitle } from "@/components/PageTitle";

export function MyNFTs() {
  const allNFTs = useGetOwnedNFTs();

  return (
    <>
      <Header />

      <div className="container mx-auto p-4 pb-16">
        <PageTitle text={<>View Your NFTs</>} />
        <div className="grid grid-cols-5 gap-4">
          {allNFTs.map((nft) => {
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
      </div>
    </>
  );
}
