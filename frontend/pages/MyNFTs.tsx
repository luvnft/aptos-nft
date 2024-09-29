import { IpfsImage } from "@/components/IpfsImage";
import { Header } from "@/components/Header";
import { useGetOwnedNFTs } from "@/hooks/useGetOwnedNFTs";
import { PageTitle } from "@/components/PageTitle";
import { Container } from "@/components/Container";

export function MyNFTs() {
  const allNFTs = useGetOwnedNFTs();

  return (
    <>
      <Header />

      <Container>
        <PageTitle text={<>View Your NFTs</>} />
        {allNFTs.length === 0 && <div className="">Loading...</div>}
        {allNFTs.length > 0 && (
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
        )}
      </Container>
    </>
  );
}
