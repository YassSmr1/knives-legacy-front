import { MutationTree } from "vuex";
import { ApproveState } from "@/store/modules/approve/types";

export enum ApproveMutations {
  SET_KNIVES_STAKING_CONTRACT_APPROVED = "SET_KNIVES_STAKING_CONTRACT_APPROVED",
  SET_RAFFLE_TICKET_CONTRACT_APPROVED = "SET_RAFFLE_TICKET_CONTRACT_APPROVED",
  SET_ERC20_CONTRACT_APPROVED = "SET_ERC20_CONTRACT_APPROVED",
}

export const mutations: MutationTree<ApproveState> = {
  [ApproveMutations.SET_KNIVES_STAKING_CONTRACT_APPROVED](
    state,
    knivesStakingContractApproved
  ) {
    state.knivesStakingContractApproved = knivesStakingContractApproved;
  },
  [ApproveMutations.SET_RAFFLE_TICKET_CONTRACT_APPROVED](
    state,
    raffleTicketContractApproved
  ) {
    state.raffleTicketContractApproved = raffleTicketContractApproved;
  },
  [ApproveMutations.SET_ERC20_CONTRACT_APPROVED](state, erc20ContractApproved) {
    state.erc20ContractApproved = erc20ContractApproved;
  },
};
