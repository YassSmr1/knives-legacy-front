import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "@/store/types";
import { connector } from "@/store/modules/connector";
import { toast } from "@/store/modules/toast";
import { loader } from "@/store/modules/loader";
import { approve } from "@/store/modules/approve";
import { knife } from "@/store/modules/knife";
import { stakingKnife } from "@/store/modules/stakingKnife";
import { ToastPlugin } from "@/store/plugins/toast";
import { supply } from "@/store/modules/supply";
import { raffle } from "@/store/modules/raffle";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    connector,
    toast,
    loader,
    approve,
    knife,
    stakingKnife,
    supply,
    raffle,
  },
  plugins: [ToastPlugin],
});
