import { IpfsImage } from "@/components/IpfsImage";
import { Header } from "@/components/Header";
import { useGetOwnedNFTs } from "@/hooks/useGetOwnedNFTs";

export function MyNFTs() {
  const allNFTs = useGetOwnedNFTs();

  return (
    <>
      <Header />

      <div className="container mx-auto p-4 pb-16">
        <h2 className="text-3xl text-center font-bold">View Your NFTs</h2>
        <div className="bg-center bg-[length:120%] bg-no-repeat relative before:content-[''] before:block before:pt-[70.8%] lg:mt-[-3rem] md:mt-[-2rem] sm:mt-[-1rem]">
          <div className="absolute w-full h-full top-0 left-0 pt-[22.4%]">
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
        </div>
      </div>
    </>
  );
}
