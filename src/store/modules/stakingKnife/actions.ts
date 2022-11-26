import { ActionTree } from "vuex";
import { RootState } from "@/store/types";
import {
  getConnectedContract,
  handleError,
  handleTxResults,
} from "@/store/utils";
import Addresses from "@/assets/addresses.json";
import IStakingKnife from "@/assets/IStakingKnife.json";
import { Knife } from "@/types/Interface";
import { KNIFE_URI } from "@/config";
import { ethers } from "ethers";
import { StakingKnifeState } from "@/store/modules/stakingKnife/types";
import { StakingKnifeMutation } from "@/store/modules/stakingKnife/mutations";
import { KnifeMutation } from "@/store/modules/knife/mutations";
import { KnifeActions } from "@/store/modules/knife/actions";
import { LoaderMutation } from "@/store/modules/loader/mutations";
import { SupplyMutation } from "@/store/modules/supply/mutations";
import { SupplyActions } from "@/store/modules/supply/actions";

export enum StakingKnifeActions {
  GET_STAKING_KNIVES = "GET_STAKING_KNIVES",
  GET_CLAIMABLE_SUPPLY = "GET_CLAIMABLE_SUPPLY",
  DEPOSIT_ALL_KNIVES = "DEPOSIT_ALL_KNIVES",
  WITHDRAW_ALL_KNIVES = "WITHDRAW_ALL_KNIVES",
  CLAIM_SUPPLY = "CLAIM_SUPPLY",
}

export const actions: ActionTree<StakingKnifeState, RootState> = {
  async [StakingKnifeActions.GET_STAKING_KNIVES]({ rootState, commit }) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    const contract = getConnectedContract(
      Addresses.stakingKnife,
      IStakingKnife,
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
    commit(StakingKnifeMutation.SET_STAKING_KNIVES, formatted);
  },
  async [StakingKnifeActions.GET_CLAIMABLE_SUPPLY]({ commit, rootState }) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    const contract = getConnectedContract(
      Addresses.stakingKnife,
      IStakingKnife,
      rootState.connector.web3Provider
    );
    const result = ethers.utils.formatEther(
      await contract.getClaimableAmount(rootState.connector.account)
    );
    const formatted = parseFloat(result).toFixed(2);
    commit(StakingKnifeMutation.SET_CLAIMABLE_SUPPLY, formatted);
  },
  async [StakingKnifeActions.DEPOSIT_ALL_KNIVES](
    { dispatch, commit, state, rootState },
    selectedKnives: Knife[]
  ) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    try {
      const ids: number[] = [];
      for (const selectedKnife of selectedKnives) {
        ids.push(selectedKnife.id);
      }
      const contract = getConnectedContract(
        Addresses.stakingKnife,
        IStakingKnife,
        rootState.connector.web3Provider
      );
      const tx = await contract.depositSelected(ids);
      if (
        await handleTxResults(
          tx,
          commit,
          "You have successfully deposited your tokens !"
        )
      ) {
        commit(
          KnifeMutation.SET_KNIVES,
          rootState.knife.knives.filter((knife) => !ids.includes(knife.id))
        );
        commit(
          StakingKnifeMutation.SET_STAKING_KNIVES,
          state.stakedKnives.concat(selectedKnives)
        );
      } else {
        await dispatch(KnifeActions.GET_KNIFE);
        await dispatch(StakingKnifeActions.GET_STAKING_KNIVES);
      }
      commit(LoaderMutation.SET_LOADING, false);
    } catch (e) {
      handleError(e, commit);
    }
  },
  async [StakingKnifeActions.WITHDRAW_ALL_KNIVES](
    { dispatch, commit, state, rootState },
    selectedKnives: Knife[]
  ) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    try {
      const ids: number[] = [];
      for (const selectedKnife of selectedKnives) {
        ids.push(selectedKnife.id);
      }
      const contract = getConnectedContract(
        Addresses.stakingKnife,
        IStakingKnife,
        rootState.connector.web3Provider
      );
      const tx = await contract.withdrawSelected(ids);
      if (
        await handleTxResults(
          tx,
          commit,
          "You have successfully withdrawn your tokens !"
        )
      ) {
        commit(
          StakingKnifeMutation.SET_STAKING_KNIVES,
          state.stakedKnives.filter((knife) => !ids.includes(knife.id))
        );
        commit(
          KnifeMutation.SET_KNIVES,
          rootState.knife.knives.concat(selectedKnives)
        );
      } else {
        await dispatch(KnifeActions.GET_KNIFE);
        await dispatch(StakingKnifeActions.GET_STAKING_KNIVES);
      }
      commit(LoaderMutation.SET_LOADING, false);
    } catch (e) {
      handleError(e, commit);
    }
  },
  async [StakingKnifeActions.CLAIM_SUPPLY]({
    dispatch,
    commit,
    state,
    rootState,
  }) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    try {
      const contract = getConnectedContract(
        Addresses.stakingKnife,
        IStakingKnife,
        rootState.connector.web3Provider
      );
      const tx = await contract.claimAll();
      if (
        await handleTxResults(
          tx,
          commit,
          "You have successfully claimed your tokens !"
        )
      ) {
        const balanceWallet = (
          parseFloat(rootState.supply.supplyWallet) +
          parseFloat(state.claimableSupply)
        ).toFixed(2);
        commit(StakingKnifeMutation.SET_CLAIMABLE_SUPPLY, "0.00");
        commit(SupplyMutation.SET_SUPPLY_WALLET, balanceWallet);
      } else {
        await dispatch(SupplyActions.GET_SUPPLY_WALLET);
        await dispatch(StakingKnifeActions.GET_CLAIMABLE_SUPPLY);
      }
      commit(LoaderMutation.SET_LOADING, false);
    } catch (e) {
      handleError(e, commit);
    }
  },
};
