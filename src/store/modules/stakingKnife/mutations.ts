import { MutationTree } from "vuex";
import { StakingKnifeState } from "@/store/modules/stakingKnife/types";

export enum StakingKnifeMutation {
  SET_STAKING_KNIVES = "SET_STAKING_KNIVES",
  SET_CLAIMABLE_SUPPLY = "SET_CLAIMABLE_SUPPLY",
}

export const mutations: MutationTree<StakingKnifeState> = {
  [StakingKnifeMutation.SET_STAKING_KNIVES](state, stakedKnives) {
    state.stakedKnives = stakedKnives;
  },
  [StakingKnifeMutation.SET_CLAIMABLE_SUPPLY](state, claimableSupply) {
    state.claimableSupply = claimableSupply;
  },
};
