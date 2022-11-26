<template>
  <modal
    :name="'winner_' + raffle.id"
    width="800px"
    height="auto"
    :adaptive="true"
    classes="modal_winner"
  >
    <div class="grid">
      <div class="left">
        <div class="title">
          {{ raffle.projectName }}
        </div>
        <div class="sub_title">
          {{ raffle.type.toUpperCase() }} RAFFLE winners
        </div>
        <div class="list">
          <div
            class="item"
            v-for="winner in raffle.winners"
            :key="winner"
            :class="
              winner.toLowerCase() === account.toLowerCase() && won
                ? 'green'
                : ''
            "
          >
            {{ truncate(winner, 20) }}
          </div>
        </div>
      </div>
      <div class="right">
        <div class="header" :class="won ? 'badges_won' : 'badges_lost'">
          {{ won ? "Win" : "Lost" }}
        </div>
        <div class="wrapper">
          <div class="title">HOW TO CLAIM YOUR PRIZE IF YOU HAVE WON ?</div>
          <div class="content">
            <span>
              1. No wallet submission: the list of winners will be transmitted
              directly to the project (to attribute the WL or to airdrop the
              NFT).
            </span>
            <span> 2. No change of wallet address possible </span>
            <span>
              3. It may be mandatory to join the project's discord - see our
              discord, in the KNIVES RAFFLE SYSTEM announcements to check this
              part.
            </span>
            <span>
              4. For any problem, please open a ticket in #raffle-ticket on
              discord and someone will help you. NO TAG/NO PING or you may be
              kick out of discord.
            </span>
            <button class="zoom" v-on:click="closeModal">CLOSE</button>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Raffle } from "@/types/Interface";

@Component({
  computed: {
    account(): string {
      return this.$store.state.connector.account;
    },
  },
})
export default class WinnerModal extends Vue {
  @Prop() raffle!: Raffle;
  @Prop() won!: boolean;

  /***
   * Truncate the string to the given length using "..."
   * @param {string} fullStr - The string to truncate
   * @param {number} strLen - The length of the truncated string
   * @returns {string}
   */
  truncate(fullStr: string, strLen: number): string {
    if (fullStr.length <= strLen) return fullStr;
    const separator = ".....";
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

  /***
   * Close the modal
   * @returns {void}
   */
  closeModal(): void {
    this.$modal.hide("winner_" + this.raffle.id);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.modal_winner {
  font-family: "Space Grotesk", sans-serif;
  padding: 40px;
  background-color: #333333 !important;
  color: white;
  @media screen and (max-width: 600px) {
    padding: 15px;
  }
  .grid {
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 30px;

    @media screen and (max-width: 600px) {
      grid-template-columns: auto;
      grid-template-rows: auto auto auto auto;
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    max-height: 400px;
    .title {
      font-weight: bold;
      font-size: 18px;
      @media screen and (max-width: 600px) {
        font-size: 14px;
      }
      text-align: center;
    }

    .sub_title {
      font-style: italic;
      font-size: 16px;
      @media screen and (max-width: 600px) {
        font-size: 12px;
        margin-bottom: 10px;
      }
      margin-bottom: 20px;
      text-align: center;
    }

    .list {
      text-align: center;
      font-weight: lighter;
      overflow-y: auto;
      font-size: 14px;
      @media screen and (max-width: 600px) {
        font-size: 12px;
      }
      padding-right: 5px;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    .header {
      margin-left: auto;
      margin-right: 0;
      margin-bottom: 10px;
    }
    .wrapper {
      border: 2px solid white;
      padding: 20px;
      @media screen and (max-width: 600px) {
        padding: 10px;
      }
      .title {
        font-weight: bold;
        font-size: 18px;
        @media screen and (max-width: 600px) {
          font-size: 14px;
        }
        margin-bottom: 10px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      row-gap: 15px;
      button {
        background-color: #666666;
        color: white;
        outline: none;
        border: none;
        cursor: pointer;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
        border-radius: 15px;
      }
      span {
        @media screen and (max-width: 600px) {
          font-size: 12px;
        }
      }
    }
  }

  .green {
    color: #349533;
  }

  .red {
    color: #ff0000;
  }

  .badges_won {
    background-color: #349533;
    padding: 5px 15px;
    border-radius: 7px;
    font-size: 16px;
    @media screen and (max-width: 600px) {
      font-size: 14px;
    }
    text-align: center;
  }

  .badges_lost {
    background-color: #ff0000;
    padding: 5px 15px;
    border-radius: 7px;
    font-size: 16px;
    @media screen and (max-width: 600px) {
      font-size: 14px;
    }
    text-align: center;
  }
}
</style>
