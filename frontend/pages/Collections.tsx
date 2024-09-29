import { Link } from "react-router-dom";
import { GetCollectionDataResponse } from "@aptos-labs/ts-sdk";
import { useGetCollections } from "@/hooks/useGetCollections";
import { IpfsImage } from "@/components/IpfsImage";
import { Header } from "@/components/Header";
import { useGetCollectionDetailData } from "@/hooks/useGetCollectionDetailData";

export function Collections() {
  const collections: Array<GetCollectionDataResponse> = useGetCollections();

  return (
    <>
      <Header />
      {collections.length === 0 && <div className="max-w-screen-xl mx-auto p-4">Loading...</div>}
      {collections.length > 0 && (
        <ul className="max-w-screen-xl mx-auto w-11/12 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
          {collections.map((item, i) => {
            return (
              <li key={i}>
                <CollectionItem collection={item} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

const CollectionItem = ({ collection }: { collection: GetCollectionDataResponse }) => {
  const { metadata } = useGetCollectionDetailData(collection);

  return (
    <div className="max-w-80 mx-auto overflow-hidden bg-primary/60 rounded-xl">
      <Link to={`/collection/${collection.collection_id}`} className="block relative aspect-square group">
        {metadata && (
          <IpfsImage
            ipfsUri={metadata.image}
            className="absolute w-full h-full object-contain group-hover:scale-105 transition-transform duration-200 pointer-events-none"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        <p className="absolute bottom-1.5 w-11/12 right-1/2 translate-x-1/2 truncate">{collection.collection_name}</p>
      </Link>
    </div>
  );
};
