<template>
  <div id="Dashboard">
    <NavBar></NavBar>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Connect from "@/components/Connect.vue";
import NavBar from "@/components/NavBar.vue";

@Component({
  components: { NavBar, Connect },
})
export default class Dashboard extends Vue {}
</script>

<style scoped lang="scss">
#Dashboard {
  display: grid;
  grid-template-columns: 14vw 1fr;
}
</style>
