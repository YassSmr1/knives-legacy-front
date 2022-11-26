<template>
  <div id="NavBar">
    <div class="wrapper">
      <img
        src="@/assets/logo_sidebar.webp"
        alt="NavBar logo"
        id="logo_sidebar"
      />
      <img src="@/assets/logo_connect.webp" alt="NavBar logo" id="min_logo" />
      <div class="category_title">THE KNIVES</div>
      <router-link to="/dashboard/knives/staking" class="link">
        <img src="@/assets/staking_router.webp" alt="Staking logo" />
        <span class="category_name">Staking</span>
      </router-link>
      <router-link to="/dashboard/knives/raffle" class="link">
        <img src="@/assets/dice.png" alt="Dice logo" />
        <span class="category_name">Raffles</span>
      </router-link>
      <router-link to="/dashboard/knives/tickets" class="link">
        <img src="@/assets/ticket.png" alt="Dice logo" />
        <span class="category_name">My Tickets</span>
      </router-link>
      <div class="category_title">ABOUT & OTHER</div>
      <a
        class="link"
        target="_blank"
        rel="noreferrer"
        href="https://docs.knives-legacy.io/"
      >
        <img src="@/assets/logo_whitepaper.webp" alt="Whitepaper logo" />
        <span class="category_name">Whitepaper</span>
      </a>
      <a
        class="link"
        target="_blank"
        rel="noreferrer"
        href="https://marketplace.kalao.io/collection/0x114712e2813451f6eb64fee2be26338d83da56c0"
      >
        <img src="@/assets/logo_market.webp" alt="Market logo" />
        <span class="category_name">Marketplace</span>
      </a>
      <div class="social">
        <a
          class="link"
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/KnivesLegacyNFT"
        >
          <img src="@/assets/twitter.png" alt="Twitter" />
        </a>
        <div class="link">
          <img
            v-if="sound"
            src="@/assets/audio_on.png"
            alt="Audio on"
            v-on:click="muteSound"
            class="sound"
          />
          <img
            v-else
            src="@/assets/audio_off.png"
            alt="Audio off"
            v-on:click="activeSound"
            class="sound"
          />
        </div>
        <a
          class="link"
          target="_blank"
          rel="noreferrer"
          href="https://discord.gg/kniveslegacynft"
        >
          <img src="@/assets/discord.png" alt="Discord" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class NavBar extends Vue {
  sound = false;

  /***
   * Mute sound of the app
   * @returns {void}
   */
  muteSound(): void {
    this.sound = false;
    const music = document.getElementById("music") as HTMLAudioElement;
    if (music) {
      music.pause();
    }
  }

  /***
   * Active sound of the app and change volume
   * @returns {void}
   */
  activeSound(): void {
    this.sound = true;
    const music = document.getElementById("music") as HTMLAudioElement;
    if (music) {
      music.volume = 0.35;
      music.play();
    }
  }
}
</script>

<style scoped lang="scss">
#NavBar {
  display: flex;
  min-width: 60px;
  background-color: black;
  color: #adadad;
  height: 100vh;
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    @media screen and (max-width: 600px) {
      justify-items: center;
    }
    #logo_sidebar {
      margin-bottom: 16.5px;
      width: 100%;
      padding: 10%;
      @media screen and (max-width: 840px) {
        display: none;
      }
    }
    #min_logo {
      display: none;
      margin-left: auto;
      margin-right: auto;
      padding: 5%;
      @media screen and (max-width: 840px) {
        display: block;
        width: 100%;
        max-height: 77px;
        max-width: 77px;
      }
    }

    .router-link-active {
      background-color: rgba(255, 255, 255, 0.1);
      border-right: 5px solid #561e1c;
    }

    .category_title {
      margin-top: 16.5px;
      font-family: "Space Grotesk", sans-serif;
      font-size: 20px;
      padding-left: 10%;
      @media screen and (max-width: 840px) {
        padding-left: 5%;
      }
      @media screen and (max-width: 600px) {
        font-size: 12px;
      }
      color: rgba(255, 255, 255, 0.5);
    }

    .link {
      display: flex;
      text-decoration: none;
      margin-top: 10px;
      padding-top: 7.5%;
      padding-bottom: 7.5%;
      width: 100%;
      height: auto;
      white-space: nowrap;
      font-family: "Space Grotesk", sans-serif;
      font-size: 19px;
      font-weight: 500;
      color: rgba(239, 239, 239);
      padding-left: 10%;
      @media screen and (max-width: 840px) {
        padding-left: 5%;
      }
      @media screen and (max-width: 532px) {
        justify-content: center;
      }
      .category_name {
        text-overflow: ellipsis;
        overflow-x: hidden;
        @media screen and (max-width: 532px) {
          display: none;
        }
      }
      .sound {
        cursor: pointer;
      }
      img {
        margin-right: 15px;
        height: 100%;
      }
    }

    .social {
      margin-top: auto;
      margin-bottom: 20px;
      padding-left: 10%;
      .link {
        justify-content: center;
      }
      @media screen and (max-width: 840px) {
        padding-left: 5%;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr;
      }
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      place-items: center;
    }
  }
}
</style>
