import { Module } from "vuex";
import { KnifeState } from "@/store/modules/knife/types";
import { RootState } from "@/store/types";
import { state } from "@/store/modules/knife/state";
import { mutations } from "@/store/modules/knife/mutations";
import { actions } from "@/store/modules/knife/actions";

export const knife: Module<KnifeState, RootState> = {
  state,
  mutations,
  actions,
};
