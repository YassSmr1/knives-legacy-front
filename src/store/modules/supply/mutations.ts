import { MutationTree } from "vuex";
import { SupplyState } from "@/store/modules/supply/types";

export enum SupplyMutation {
  SET_SUPPLY_WALLET = "SET_SUPPLY_WALLET",
}

export const mutations: MutationTree<SupplyState> = {
  [SupplyMutation.SET_SUPPLY_WALLET](state, supplyWallet) {
    state.supplyWallet = supplyWallet;
  },
};
