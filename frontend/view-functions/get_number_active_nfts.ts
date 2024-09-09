import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { AccountAddress } from "@aptos-labs/ts-sdk";

export type GetNumberActiveNFTsArguments = {
  collection_id: string;
};

export const getNumberActiveNFTs = async (args: GetNumberActiveNFTsArguments): Promise<number> => {
  const { collection_id } = args;
  const count = await aptosClient().view<[number]>({
    payload: {
      function: `${AccountAddress.from(MODULE_ADDRESS)}::launchpad::get_number_active_nfts`,
      functionArguments: [collection_id],
    },
  });
  return count[0];
};
