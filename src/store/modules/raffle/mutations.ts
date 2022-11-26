import { RaffleState } from "@/store/modules/raffle/types";
import { MutationTree } from "vuex";

export enum RaffleMutation {
  SET_DISPLAYED_RAFFLES = "SET_DISPLAYED_RAFFLES",
}

export const mutations: MutationTree<RaffleState> = {
  [RaffleMutation.SET_DISPLAYED_RAFFLES](state, displayedRaffles) {
    state.displayedRaffles = displayedRaffles;
  },
};
