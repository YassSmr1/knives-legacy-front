import { Module } from "vuex";
import { RaffleState } from "@/store/modules/raffle/types";
import { RootState } from "@/store/types";
import { state } from "@/store/modules/raffle/state";
import { mutations } from "@/store/modules/raffle/mutations";
import { actions } from "@/store/modules/raffle/actions";

export const raffle: Module<RaffleState, RootState> = {
  state,
  mutations,
  actions,
};
