<template>
  <div id="Connect">
    <button v-if="!account" class="btn_connect zoom" v-on:click="openModal">
      Connect
    </button>
    <div v-else class="account_name" v-on:click="disconnect">
      <img src="@/assets/logo_connect.webp" alt="logo connect" />
      {{ truncate(account, 14) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ConnectorActions } from "@/store/modules/connector/actions";

@Component({
  computed: {
    account: function () {
      return this.$store.state.connector.account;
    },
  },
})
export default class Connect extends Vue {
  /***
   * Open the modal used to connect to the Avalanche network
   * @returns {void}
   */
  openModal(): void {
    this.$modal.show("connect");
  }

  /***
   * Dispatch the disconnect action
   * @returns {void}
   */
  disconnect(): void {
    this.$store.dispatch(ConnectorActions.DISCONNECT);
  }

  /***
   * Truncate the string to the given length using "..."
   * @param {string} fullStr - The string to truncate
   * @param {number} strLen - The length of the truncated string
   * @returns {string}
   */
  truncate(fullStr: string, strLen: number): string {
    if (fullStr.length <= strLen) return fullStr;
    const separator = "...";
    const sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);
    return (
      fullStr.substring(0, frontChars) +
      separator +
      fullStr.substring(fullStr.length - backChars)
    );
  }
}
</script>

<style scoped lang="scss">
#Connect {
  .btn_connect {
    backdrop-filter: blur(10px);
    background: rgba(121, 120, 120, 0.3);
    color: white;
    margin-top: 20px;
    font-family: "Space Grotesk", sans-serif;
    font-size: 16px;
    cursor: pointer;
    padding: 10px 30px;
    border-radius: 20px;
  }

  .account_name {
    display: flex;
    align-items: center;
    backdrop-filter: blur(10px);
    background: rgba(121, 120, 120, 0.3);
    color: white;
    margin-top: 20px;
    font-family: "Space Grotesk", sans-serif;
    font-size: 14px;
    cursor: pointer;
    padding: 2px 20px;
    border-radius: 20px;
    img {
      margin-right: 5px;
      height: 36px;
    }
  }
}
</style>
