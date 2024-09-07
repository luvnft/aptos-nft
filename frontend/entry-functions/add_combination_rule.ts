import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type AddCombinationRuleArguments = {
  main_collection: string;
  main_token: string;
  secondary_collection: string;
  secondary_token: string;
  result_token: string;
};

export const addCombinationRule = (args: AddCombinationRuleArguments): InputTransactionData => {
  const { main_collection, main_token, secondary_collection, secondary_token, result_token } = args;
  return {
    data: {
      function: `${import.meta.env.VITE_MODULE_ADDRESS}::launchpad::add_combination_rule`,
      typeArguments: [],
      functionArguments: [main_collection, main_token, secondary_collection, secondary_token, result_token],
    },
  };
};
