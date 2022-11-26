<template>
  <div id="RaffleTile">
    <WinnerModal :raffle="raffle" :won="won" />
    <BuyModal
      :raffle="raffle"
      :buy-function="buy"
      :tickets="tickets"
      :price="total"
      :selected="
        selected === ''
          ? selected
          : raffle.erc20names[raffle.erc20address.indexOf(selected)]
      "
    />
    <div class="status" :class="raffle.status">
      {{ raffle.status.toUpperCase() }}
    </div>
    <img :src="raffle.imageUrl" alt="Raffle thumb" height="200" width="250" />
    <div class="wrapper">
      <div class="raffle_title">
        #{{ raffle.id }} - {{ raffle.projectName }}
      </div>
      <div class="raffle_socials">
        <a :href="raffle.twitter" target="_blank">
          <img src="@/assets/twitter.png" alt="Twitter" />
        </a>
        <a :href="raffle.discord" target="_blank">
          <img src="@/assets/discord.png" alt="Discord" />
        </a>
      </div>
      <div class="raffle_items">
        {{ raffle.startDate.format("DD.MM") }} to
        {{ raffle.endDate.format("DD.MM.YY - HH:mm") }} UTC
      </div>
      <div class="raffle_items raffle_flex">
        <div class="raffle_items">Type</div>
        <div class="raffle_type" :class="raffle.type.toLowerCase()">
          {{ raffle.type.toUpperCase() }}
        </div>
      </div>
      <div class="raffle_items raffle_flex">
        <div class="raffle_items">Winner(s)</div>
        <div class="raffle_items">{{ raffle.winnersAmount }}</div>
      </div>
      <div class="raffle_items raffle_flex">
        <div class="raffle_items">Project mint date</div>
        <div class="raffle_items">
          {{ raffle.mintTimestamp.format("DD.MM.YYYY") }}
        </div>
      </div>
      <div class="raffle_items raffle_flex">
        <div class="raffle_items">Project mint price</div>
        <div class="raffle_items">{{ raffle.nftPrice }} $AVAX</div>
      </div>
      <div class="raffle_items raffle_flex">
        <div class="raffle_items">Total Max Tickets</div>
        <div class="raffle_items">{{ raffle.maxTickets }}</div>
      </div>
      <div class="raffle_items raffle_flex">
        <div class="raffle_items">Network</div>
        <div class="raffle_items">{{ raffle.network }}</div>
      </div>
      <div class="raffle_items raffle_flex">
        <div class="raffle_items">Current entries</div>
        <div class="raffle_items">{{ raffle.currentEntries }}</div>
      </div>
      <div class="raffle_items raffle_flex">
        <div class="raffle_items">Platform fees</div>
        <div class="raffle_items">{{ raffle.mintFee }} $AVAX</div>
      </div>
      <div class="raffle_items raffle_flex raffle_price">
        <div class="raffle_items">PRICE</div>
        <select class="raffle_items" v-on:change="handleTokenSelect">
          <option value="" selected>{{ raffle.price }} $SUPPLY</option>
          <option
            v-for="(option, index) in raffle.erc20address"
            :key="'value_' + index"
            :value="option"
          >
            {{ raffle.erc20prices[index] }} ${{ raffle.erc20names[index] }}
          </option>
        </select>
      </div>
      <div
        class="raffle_flex"
        v-if="raffle.status === 'open' || raffle.status === 'soon'"
      >
        <div
          :class="raffle.status === 'soon' ? 'left_soon counter' : 'counter'"
        >
          <span class="number">{{ tickets }} </span>/
          {{ userMaxEntries }} tickets max
        </div>
        <div class="increment" v-if="raffle.status === 'open'">
          <img
            src="@/assets/remove.png"
            alt="Decrease"
            v-on:click="decreaseTickets"
          />
          <img
            src="@/assets/add.png"
            alt="Increase"
            v-on:click="increaseTickets"
          />
        </div>
      </div>
      <button
        class="btn_buy zoom"
        v-if="
          raffle.status === 'open' &&
          !loading &&
          account &&
          ((selected !== '' && erc20ContractApproved) ||
            (selected === '' && raffleTicketContractApproved))
        "
        v-on:click="openBuyModal"
      >
        Buy for {{ total }}
        {{
          selected === ""
            ? "$SUPPLY"
            : "$" + raffle.erc20names[raffle.erc20address.indexOf(selected)]
        }}
      </button>
      <button
        class="btn_buy zoom"
        v-if="raffle.status === 'open' && !loading && !account"
        v-on:click="openConnectModal"
      >
        Connect
      </button>
      <button
        class="btn_buy zoom"
        v-if="
          raffle.status === 'open' &&
          account &&
          !loading &&
          ((selected !== '' && !erc20ContractApproved) ||
            (selected === '' && !raffleTicketContractApproved))
        "
        v-on:click="approve"
      >
        Approve Contract
      </button>
      <Loader
        v-if="raffle.status === 'open' && loading"
        style="height: 10px; width: 10px; margin-top: 15px"
      ></Loader>
      <div class="soon_div" v-if="raffle.status === 'soon'">SOON</div>
      <div
        class="close_div zoom"
        v-if="raffle.status === 'close' && raffle.winners.length > 0"
        :class="won ? 'won' : 'lost'"
        v-on:click="openWinnerModal"
      >
        {{ won ? "CONGRATS" : "SEE" }} WINNERS
      </div>
      <div
        class="close_div"
        v-if="raffle.status === 'close' && raffle.winners.length === 0"
      >
        CLOSED
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Raffle } from "@/types/Interface";
import Loader from "@/components/Loader.vue";
import { ToastMutations } from "@/store/modules/toast/mutations";
import { LoaderMutation } from "@/store/modules/loader/mutations";
import { RaffleActions } from "@/store/modules/raffle/actions";
import { ApproveActions } from "@/store/modules/approve/actions";
import WinnerModal from "@/components/WinnerModal.vue";
import { MutationPayload } from "vuex";
import { ConnectorMutations } from "@/store/modules/connector/mutations";
import BuyModal from "@/components/BuyModal.vue";
import { ApproveMutations } from "@/store/modules/approve/mutations";

@Component({
  components: { BuyModal, WinnerModal, Loader },
  computed: {
    loading: function (): boolean {
      return this.$store.state.loader.loading;
    },
    raffleTicketContractApproved: function (): boolean {
      return this.$store.state.approve.raffleTicketContractApproved;
    },
    erc20ContractApproved: function (): boolean {
      return this.$store.state.approve.erc20ContractApproved;
    },
    account: function () {
      return this.$store.state.connector.account;
    },
  },
})
export default class RaffleInfo extends Vue {
  @Prop() raffle!: Raffle;
  unsubscribe: () => void = () => null;
  selected = "";
  tickets = 0;
  total = 0;
  won = false;
  currentEntries = 0;
  userMaxEntries = this.raffle.maxTicketsPerWallet;

  /***
   * Initialize the component, and subscribe to the store to update the data
   * @returns {void}
   */
  mounted(): void {
    this.currentEntries = this.raffle.participants.length;
    if (this.$store.state.connector.account) {
      this.init();
    }
    this.unsubscribe = this.$store.subscribe((mutation: MutationPayload) => {
      if (
        mutation.type === ConnectorMutations.SET_ACCOUNT &&
        mutation.payload
      ) {
        this.init();
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

  /***
   * Initialize the component
   * @returns {void}
   */
  init(): void {
    const entries = this.raffle.participants.filter((participant) => {
      return (
        this.$store.state.connector.account.toLowerCase() ===
        participant.toLowerCase()
      );
    }).length;
    this.userMaxEntries = this.userMaxEntries - entries;
    this.won = this.raffle.winners.some((winner) => {
      return (
        this.$store.state.connector.account.toLowerCase() ===
        winner.toLowerCase()
      );
    });
  }

  /***
   * Increase the tickets to buy
   * @returns {void}
   */
  increaseTickets(): void {
    if (this.tickets < this.userMaxEntries && this.selected === "") {
      this.tickets++;
      this.total = +(this.tickets * parseFloat(this.raffle.price)).toFixed(2);
    } else if (this.tickets < this.userMaxEntries && this.selected !== "") {
      this.tickets++;
      this.total = +(
        this.tickets *
        parseFloat(
          this.raffle.erc20prices[
            this.raffle.erc20address.indexOf(this.selected)
          ]
        )
      ).toFixed(2);
    }
  }

  /***
   * Decrease the tickets to buy
   * @returns {void}
   */
  decreaseTickets(): void {
    if (this.tickets > 0 && this.selected === "") {
      this.tickets--;
      this.total = +(this.tickets * parseFloat(this.raffle.price)).toFixed(2);
    } else if (this.tickets > 0 && this.selected !== "") {
      this.tickets--;
      this.total = +(
        this.tickets *
        parseFloat(
          this.raffle.erc20prices[
            this.raffle.erc20address.indexOf(this.selected)
          ]
        )
      ).toFixed(2);
    }
  }

  /***
   * Open the modal used to connect the wallet
   * @returns {void}
   */
  openConnectModal(): void {
    this.$modal.show("connect");
  }

  /***
   * Open the modal used to recapitulate the buy
   * @returns {void}
   */
  openBuyModal(): void {
    if (this.tickets === 0) {
      this.$store.commit(
        ToastMutations.SET_ERROR,
        "U need to buy at least one ticket"
      );
      return;
    }
    this.$modal.show("buy_" + this.raffle.id);
  }

  /***
   * Handle the token selection of currency to buy the tickets and check if the token is approved
   * @param {Event} $event - The event triggered by the input select
   * @returns {Promise<void>}
   */
  async handleTokenSelect($event: Event): Promise<void> {
    const target = $event.target as HTMLSelectElement;
    this.$store.commit(ApproveMutations.SET_ERC20_CONTRACT_APPROVED, false);
    if (target.value) {
      this.selected = target.value;
      this.tickets = 0;
      this.total = 0;
      await this.$store.dispatch(
        ApproveActions.GET_ERC20_CONTRACT_APPROVAL,
        target.value
      );
    } else {
      this.selected = "";
      this.tickets = 0;
      this.total = 0;
      await this.$store.dispatch(
        ApproveActions.GET_RAFFLE_TICKET_CONTRACT_APPROVAL
      );
    }
  }

  /***
   * Buy the tickets using the selected currency
   * @returns {Promise<void>}
   */
  async buy(): Promise<void> {
    this.$store.commit(LoaderMutation.SET_LOADING, true);
    let result = false;
    if (this.selected === "") {
      result = await this.$store.dispatch(RaffleActions.BUY_RAFFLE_TICKET, {
        raffleId: this.raffle.id,
        amount: this.tickets,
        mintFee: parseFloat(this.raffle.mintFee),
      });
    } else if (this.selected !== "") {
      result = await this.$store.dispatch(
        RaffleActions.BUY_RAFFLE_TICKET_WITH_ERC20,
        {
          raffleId: this.raffle.id,
          amount: this.tickets,
          mintFee: parseFloat(this.raffle.mintFee),
          index: this.raffle.erc20address.indexOf(this.selected),
        }
      );
    }
    if (result) {
      this.currentEntries = this.currentEntries + this.tickets;
      this.userMaxEntries = this.userMaxEntries - this.tickets;
    }
    this.tickets = 0;
    this.total = 0;
  }

  /***
   * Approve the raffle ticket contract to spend the selected currency
   * @returns {Promise<void>}
   */
  async approve(): Promise<void> {
    this.$store.commit(LoaderMutation.SET_LOADING, true);
    if (this.selected) {
      await this.$store.dispatch(
        ApproveActions.APPROVE_ERC20_CONTRACT,
        this.selected
      );
    } else {
      await this.$store.dispatch(ApproveActions.APPROVE_RAFFLE_TICKET_CONTRACT);
    }
  }

  /***
   * open the winner modal
   * @returns {void}
   */
  openWinnerModal(): void {
    this.$modal.show("winner_" + this.raffle.id);
  }
}
</script>

<style scoped lang="scss">
#RaffleTile {
  position: relative;
  background-color: #333333;
  border-radius: 20px;

  img {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  .open {
    background-color: #339933;
  }

  .soon {
    background-color: #663399;
  }

  .close {
    background-color: #3333cc;
  }

  .whitelist {
    background-color: #336633;
  }

  .nft {
    background-color: #cc9900;
  }

  .lost {
    color: #9d4343;
  }

  .won {
    color: #4f774f;
  }

  .left_soon {
    margin-left: 0 !important;
    margin-right: auto !important;
  }

  .status {
    position: absolute;
    top: 30px;
    left: 0;
    font-family: "Space Grotesk", sans-serif;
    font-size: 16px;
    color: white;
    padding: 5px 15%;
  }

  .wrapper {
    margin-left: 7.5%;
    margin-right: 7.5%;
    display: grid;
    grid-template-rows: repeat(13, auto);
    width: 85%;

    .raffle_title {
      font-family: "Space Grotesk", sans-serif;
      font-size: 16px;
      font-weight: bold;
      color: white;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .raffle_socials {
      display: flex;
      flex-direction: row;
      column-gap: 10px;

      img {
        height: 16px;
        width: 16px;
      }

      margin-bottom: 10px;
    }

    .raffle_items {
      font-family: "Space Grotesk", sans-serif;
      font-size: 13px;
      font-style: italic;
      color: white;

      select {
        background-color: #464545;
        border: none;
        font-family: "Space Grotesk", sans-serif;
        font-size: 13px;
        color: white;
        width: fit-content;
        text-align: center;
        border-radius: 10px;
      }
    }

    .raffle_flex {
      margin-top: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;

      div {
        &:first-child {
          margin-left: 0;
          margin-right: auto;
        }

        &:last-child {
          margin-left: auto;
          margin-right: 0;
        }
      }
    }

    .raffle_type {
      padding-left: 5px;
      padding-right: 5px;
      border-radius: 5px;
    }

    .raffle_price {
      margin-top: 7px;
      margin-bottom: 7px;
    }

    .counter {
      font-family: "Space Grotesk", sans-serif;
      font-size: 13px;
      color: white;
      font-style: italic;

      .number {
        font-style: normal;
        font-size: 20px;
        font-weight: bold;
      }
    }

    .soon_div {
      font-family: "Space Grotesk", sans-serif;
      font-size: 14px;
      font-weight: bold;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 8px 10%;
      margin-bottom: 10px;
      margin-top: 5px;
      background-color: #663399;
      text-align: center;
    }

    .close_div {
      font-family: "Space Grotesk", sans-serif;
      font-size: 14px;
      font-weight: bold;
      border: none;
      border-radius: 10px;
      padding: 8px 10%;
      margin-top: 35px;
      margin-bottom: 10px;
      background-color: #cccccc;

      &:hover {
        background-color: #bebebe;
      }

      text-align: center;
      cursor: pointer;
    }

    .btn_buy {
      font-family: "Space Grotesk", sans-serif;
      font-size: 14px;
      font-weight: bold;
      color: white;
      background-color: #336633;

      &:hover {
        background-color: #438943;
      }

      border: none;
      border-radius: 10px;
      padding: 8px 10%;
      margin-bottom: 10px;
      cursor: pointer;
      margin-top: 5px;
    }

    .increment {
      img {
        cursor: pointer;
        width: 20px;
        height: 20px;

        &:first-child {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
