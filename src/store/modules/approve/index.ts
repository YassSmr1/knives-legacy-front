import { Module } from "vuex";
import { ApproveState } from "@/store/modules/approve/types";
import { RootState } from "@/store/types";
import { state } from "@/store/modules/approve/state";
import { mutations } from "@/store/modules/approve/mutations";
import { actions } from "@/store/modules/approve/actions";

export const approve: Module<ApproveState, RootState> = {
  state,
  mutations,
  actions,
};
