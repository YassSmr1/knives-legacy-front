import { SupplyState } from "@/store/modules/supply/types";
import { ActionTree } from "vuex";
import { RootState } from "@/store/types";
import { getConnectedContract } from "@/store/utils";
import Addresses from "@/assets/addresses.json";
import ILegacy from "@/assets/ILegacy.json";
import { ethers } from "ethers";
import { SupplyMutation } from "@/store/modules/supply/mutations";

export enum SupplyActions {
  GET_SUPPLY_WALLET = "GET_SUPPLY_WALLET",
}

export const actions: ActionTree<SupplyState, RootState> = {
  async [SupplyActions.GET_SUPPLY_WALLET]({ rootState, commit }) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    const contract = getConnectedContract(
      Addresses.legacyToken,
      ILegacy,
      rootState.connector.web3Provider
    );
    const result = ethers.utils.formatEther(
      await contract.balanceOf(rootState.connector.account)
    );
    const formatted = parseFloat(result).toFixed(2);
    commit(SupplyMutation.SET_SUPPLY_WALLET, formatted);
  },
};
