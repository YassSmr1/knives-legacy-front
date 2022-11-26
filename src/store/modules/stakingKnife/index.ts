import { Module } from "vuex";
import { StakingKnifeState } from "@/store/modules/stakingKnife/types";
import { RootState } from "@/store/types";
import { state } from "@/store/modules/stakingKnife/state";
import { mutations } from "@/store/modules/stakingKnife/mutations";
import { actions } from "@/store/modules/stakingKnife/actions";

export const stakingKnife: Module<StakingKnifeState, RootState> = {
  state,
  mutations,
  actions,
};
