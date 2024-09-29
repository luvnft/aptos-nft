import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetCollectionData } from "@/hooks/useGetCollectionData";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody } from "@/components/ui/table";
import { CollectionRow, CollectionTableHeader } from "./Collections";
import { GetCollectionDataResponse } from "@aptos-labs/ts-sdk";
import { Header } from "@/components/Header";
import { Container } from "@/components/Container";
import { PageTitle } from "@/components/PageTitle";

export function CollectionDetail() {
  const { collection_id } = useParams<{ collection_id: string }>();
  const { data, isLoading } = useGetCollectionData(collection_id);

  const queryClient = useQueryClient();
  const { account } = useWallet();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [account, queryClient]);

  return (
    <>
      <Header />

      <Container>
        <PageTitle text={<>Collection Detail</>} />
        {isLoading ? (
          <div className="">Loading...</div>
        ) : !data ? (
          <div className="">Collection not found</div>
        ) : (
          <div className="py-3 bg-primary-foreground/90 rounded-xl text-primary overflow-hidden">
            <Table>
              <CollectionTableHeader />
              <TableBody>
                <CollectionRow collection={data.collection as GetCollectionDataResponse} isDetail />
              </TableBody>
            </Table>
          </div>
        )}
      </Container>
    </>
  );
}
