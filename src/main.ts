import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import VModal from "vue-js-modal";
import { RootState } from "@/store/types";

Vue.config.productionTip = false;
Vue.use(VueToast);
Vue.use(VModal, { dynamicDefault: { adaptive: true } });

Object.defineProperty(Vue.prototype, "$typedState", {
  get(): RootState {
    return this.$store.state;
  },
});

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
