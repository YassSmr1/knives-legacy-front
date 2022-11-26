<template>
  <div id="app">
    <ConnectModal></ConnectModal>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Home from "@/components/Home.vue";
import { ConnectorActions } from "@/store/modules/connector/actions";
import ConnectModal from "@/components/ConnectModal.vue";
@Component({
  components: {
    Home,
    ConnectModal,
  },
})
export default class App extends Vue {
  mounted(): void {
    this.$store.dispatch(ConnectorActions.GET_FROM_LOCAL_STORAGE);
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.zoom:hover {
  transform: scale(1.1);
}

.v-toast {
  font-family: "Space Grotesk", sans-serif;
}

.vm--modal {
  background-color: unset !important;
}
</style>
