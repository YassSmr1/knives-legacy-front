<template>
  <div id="SupplyDisplay">
    <div class="account_name">$SUPPLY: {{ supplyWallet }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { MutationPayload } from "vuex";
import { SupplyActions } from "@/store/modules/supply/actions";
import { ConnectorMutations } from "@/store/modules/connector/mutations";

@Component({
  components: {},
  computed: {
    supplyWallet: function (): string {
      return this.$store.state.supply.supplyWallet;
    },
  },
})
export default class SupplyDisplay extends Vue {
  unsubscribe: () => void = () => null;
  /***
   * Initialize the component, and subscribe to the store to update the data
   * @returns {void}
   */
  mounted(): void {
    if (this.$store.state.connector.account) {
      this.$store.dispatch(SupplyActions.GET_SUPPLY_WALLET);
    }
    this.unsubscribe = this.$store.subscribe((mutation: MutationPayload) => {
      if (
        mutation.type === ConnectorMutations.SET_ACCOUNT &&
        mutation.payload
      ) {
        this.$store.dispatch(SupplyActions.GET_SUPPLY_WALLET);
      }
    });
  }

  /***
   * Remove the subscription to the store
   * @returns {void}
   */
  unmounted(): void {
    this.unsubscribe();
  }
}
</script>

<style scoped lang="scss">
#SupplyDisplay {
  .account_name {
    display: flex;
    align-items: center;
    backdrop-filter: blur(10px);
    background: rgba(121, 120, 120, 0.3);
    color: white;
    margin-top: 20px;
    font-family: "Space Grotesk", sans-serif;
    font-size: 14px;
    padding: 2px 20px;
    border-radius: 20px;
    height: 40px;
  }
}
</style>
