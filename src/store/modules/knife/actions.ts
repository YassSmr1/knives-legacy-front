import { ActionTree } from "vuex";
import { KnifeState } from "@/store/modules/knife/types";
import { RootState } from "@/store/types";
import { getConnectedContract } from "@/store/utils";
import Addresses from "@/assets/addresses.json";
import IKread from "@/assets/IKread.json";
import { Knife } from "@/types/Interface";
import { KNIFE_URI } from "@/config";
import { KnifeMutation } from "@/store/modules/knife/mutations";

export enum KnifeActions {
  GET_KNIFE = "GET_KNIFE",
}

export const actions: ActionTree<KnifeState, RootState> = {
  async [KnifeActions.GET_KNIFE]({ rootState, commit }) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    const contract = getConnectedContract(
      Addresses.read,
      IKread,
      rootState.connector.web3Provider
    );
    const result = await contract.tokenIdsOfUser(rootState.connector.account);
    const formatted = [] as Knife[];
    for (const resultElement of result) {
      const tokenId = resultElement.toNumber();
      formatted.push({
        id: tokenId,
        image: KNIFE_URI + tokenId + ".png",
      });
    }
    commit(KnifeMutation.SET_KNIVES, formatted);
  },
};
