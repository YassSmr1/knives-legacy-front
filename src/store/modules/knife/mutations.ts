import { MutationTree } from "vuex";
import { KnifeState } from "@/store/modules/knife/types";

export enum KnifeMutation {
  SET_KNIVES = "SET_KNIVES",
}

export const mutations: MutationTree<KnifeState> = {
  [KnifeMutation.SET_KNIVES](state, knives) {
    state.knives = knives;
  },
};
