<template>
  <div id="Home">
    <div id="HomeHeader">
      <Connect></Connect>
    </div>
    <div class="main">
      <div class="wrapper">
        <div class="logo_wrapper">
          <img
            src="@/assets/logoHome.webp"
            class="main_logo"
            alt="logo"
            id="logo"
          />
        </div>
        <span class="main_text"
          >Soldiers, Avalanche need his army<br />Will you answer the call
          ?</span
        >
        <button class="btn_enter" v-on:click="navigateToDashboard">
          ENTER APP ⇢
        </button>
      </div>
    </div>
    <div id="HomeFooter">
      <a target="_blank" rel="noreferrer" href="https://docs.knives-legacy.io/"
        >WHITEPAPER</a
      >
      <a
        target="_blank"
        rel="noreferrer"
        href="https://marketplace.kalao.io/collection/0x114712e2813451f6eb64fee2be26338d83da56c0"
      >
        Marketplace</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Connect from "@/components/Connect.vue";

@Component({
  components: { Connect },
  computed: {
    account: function () {
      return this.$store.state.connector.account;
    },
  },
})
export default class Home extends Vue {
  /***
   * Redirect to the dashboard
   * @returns {Promise<void>}
   */
  async navigateToDashboard(): Promise<void> {
    await this.$router.push("dashboard/knives/raffle");
  }
}
</script>

<style scoped lang="scss">
#Home {
  width: 100%;
  height: 100vh;
  background-image: url("~@/assets/homeFilter.webp"),
    url("~@/assets/homeBackground.webp");
  background-size: cover;
  background-repeat: no-repeat;

  display: grid;
  grid-template-rows: 1fr 1fr 1fr;

  #HomeHeader {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    margin-right: 40px;
  }

  .main {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    @media screen and (max-width: 763px) {
      align-items: center;
      flex-direction: inherit;
      justify-content: inherit;
    }
    .wrapper {
      display: flex;
      margin-right: 10%;
      flex-direction: column;
      align-items: flex-start;
      max-width: 590px;
      @media screen and (max-width: 763px) {
        margin-left: 2%;
        margin-right: 2%;
      }

      .logo_wrapper {
        width: 100%;
        .main_logo {
          width: 100%;
          height: 100%;
        }
      }
    }
    &_text {
      margin-top: 31px;
      color: #ebd4cc;
      font-size: 31px;
      text-align: left;
      opacity: 0.7;
      font-family: "Space Grotesk", sans-serif;
      @media screen and (max-width: 763px) {
        font-size: 5vw;
      }
    }
    .btn_enter {
      margin-top: 31px;
      outline: inherit;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 24px;
      font-family: "Space Grotesk", sans-serif;
      font-weight: bold;
      text-decoration: none;
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }

  #HomeFooter {
    display: grid;
    grid-template-columns: 1fr 1fr;
    place-items: center;
    align-items: end;
    margin-bottom: 20px;
    a {
      text-decoration: none;
      color: rgba(255, 255, 255, 0.5);
      font-family: "Space Grotesk", sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      &:hover {
        color: white;
      }
    }
  }
}
</style>
