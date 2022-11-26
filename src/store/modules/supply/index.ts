import { Module } from "vuex";
import { SupplyState } from "@/store/modules/supply/types";
import { RootState } from "@/store/types";
import { state } from "@/store/modules/supply/state";
import { mutations } from "@/store/modules/supply/mutations";
import { actions } from "@/store/modules/supply/actions";

export const supply: Module<SupplyState, RootState> = {
  state,
  mutations,
  actions,
};
