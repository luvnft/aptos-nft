import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type combineNFTArguments = {
  main_collection_obj: string;
  secondary_collection_obj: string;
  main_nft: string;
  secondary_nft: string;
};

export const combineNFT = (args: combineNFTArguments): InputTransactionData => {
  const { main_collection_obj, secondary_collection_obj, main_nft, secondary_nft } = args;
  return {
    data: {
      function: `${import.meta.env.VITE_MODULE_ADDRESS}::launchpad::combine_nft`,
      typeArguments: [],
      functionArguments: [main_collection_obj, secondary_collection_obj, main_nft, secondary_nft],
    },
  };
};
