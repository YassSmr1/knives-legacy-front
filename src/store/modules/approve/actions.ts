import { ActionTree } from "vuex";
import { ApproveState } from "@/store/modules/approve/types";
import { RootState } from "@/store/types";
import {
  getConnectedContract,
  handleError,
  handleTxResults,
} from "@/store/utils";
import Addresses from "@/assets/addresses.json";
import IKnife from "@/assets/IKnife.json";
import ILegacy from "@/assets/ILegacy.json";
import { ethers } from "ethers";
import { ApproveMutations } from "@/store/modules/approve/mutations";
import { LoaderMutation } from "@/store/modules/loader/mutations";

export enum ApproveActions {
  APPROVE_KNIVES_STAKING_CONTRACT = "APPROVE_KNIVES_STAKING_CONTRACT",
  APPROVE_RAFFLE_TICKET_CONTRACT = "APPROVE_RAFFLE_TICKET_CONTRACT",
  APPROVE_ERC20_CONTRACT = "APPROVE_ERC20_CONTRACT",
  GET_KNIVES_STAKING_CONTRACT_APPROVAL = "GET_KNIVES_STAKING_CONTRACT_APPROVAL",
  GET_RAFFLE_TICKET_CONTRACT_APPROVAL = "GET_RAFFLE_TICKET_CONTRACT_APPROVAL",
  GET_ERC20_CONTRACT_APPROVAL = "GET_ERC20_CONTRACT_APPROVAL",
}

export const actions: ActionTree<ApproveState, RootState> = {
  async [ApproveActions.GET_KNIVES_STAKING_CONTRACT_APPROVAL]({
    commit,
    rootState,
  }) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    const contract = getConnectedContract(
      Addresses.knives,
      IKnife,
      rootState.connector.web3Provider
    );
    const result = await contract.isApprovedForAll(
      rootState.connector.account,
      Addresses.stakingKnife
    );
    commit(ApproveMutations.SET_KNIVES_STAKING_CONTRACT_APPROVED, result);
  },
  async [ApproveActions.GET_RAFFLE_TICKET_CONTRACT_APPROVAL]({
    commit,
    rootState,
  }) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    const contract = getConnectedContract(
      Addresses.legacyToken,
      ILegacy,
      rootState.connector.web3Provider
    );
    const result = await contract.allowance(
      rootState.connector.account,
      Addresses.raffleTicket
    );
    commit(
      ApproveMutations.SET_RAFFLE_TICKET_CONTRACT_APPROVED,
      result.gte(ethers.utils.parseEther("2000"))
    );
  },
  async [ApproveActions.GET_ERC20_CONTRACT_APPROVAL](
    { commit, rootState },
    tokenAddress
  ) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    const contract = getConnectedContract(
      tokenAddress,
      ILegacy,
      rootState.connector.web3Provider
    );
    const result = await contract.allowance(
      rootState.connector.account,
      Addresses.raffleTicket
    );
    commit(
      ApproveMutations.SET_ERC20_CONTRACT_APPROVED,
      result.gte(ethers.utils.parseEther("2000"))
    );
  },
  async [ApproveActions.APPROVE_KNIVES_STAKING_CONTRACT]({
    dispatch,
    commit,
    rootState,
  }) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    try {
      const contract = getConnectedContract(
        Addresses.knives,
        IKnife,
        rootState.connector.web3Provider
      );
      const tx = await contract.setApprovalForAll(Addresses.stakingKnife, true);
      if (
        await handleTxResults(
          tx,
          commit,
          "You have successfully approved your tokens !"
        )
      ) {
        commit(ApproveMutations.SET_KNIVES_STAKING_CONTRACT_APPROVED, true);
      } else {
        dispatch(ApproveActions.GET_KNIVES_STAKING_CONTRACT_APPROVAL);
      }
      commit(LoaderMutation.SET_LOADING, false);
    } catch (e) {
      handleError(e, commit);
    }
  },
  async [ApproveActions.APPROVE_RAFFLE_TICKET_CONTRACT]({
    dispatch,
    commit,
    rootState,
  }) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    try {
      const contract = getConnectedContract(
        Addresses.legacyToken,
        ILegacy,
        rootState.connector.web3Provider
      );
      const tx = await contract.approve(
        Addresses.raffleTicket,
        ethers.constants.MaxUint256
      );
      if (
        await handleTxResults(
          tx,
          commit,
          "You have successfully approved your tokens !"
        )
      ) {
        commit(ApproveMutations.SET_RAFFLE_TICKET_CONTRACT_APPROVED, true);
      } else {
        await dispatch(ApproveActions.GET_RAFFLE_TICKET_CONTRACT_APPROVAL);
      }
      commit(LoaderMutation.SET_LOADING, false);
    } catch (e) {
      handleError(e, commit);
    }
  },
  async [ApproveActions.APPROVE_ERC20_CONTRACT](
    { commit, dispatch, rootState },
    contractAddress
  ) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    try {
      const contract = getConnectedContract(
        contractAddress,
        ILegacy,
        rootState.connector.web3Provider
      );
      const tx = await contract.approve(
        Addresses.raffleTicket,
        ethers.constants.MaxUint256
      );
      if (
        await handleTxResults(
          tx,
          commit,
          "You have successfully approved your tokens !"
        )
      ) {
        commit(ApproveMutations.SET_ERC20_CONTRACT_APPROVED, true);
      } else {
        await dispatch(
          ApproveActions.GET_ERC20_CONTRACT_APPROVAL,
          contractAddress
        );
      }
      commit(LoaderMutation.SET_LOADING, false);
    } catch (e) {
      handleError(e, commit);
    }
  },
};
