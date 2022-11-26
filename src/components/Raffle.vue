<template>
  <div id="Raffle">
    <div class="info_wrapper">
      <Connect></Connect>
      <SupplyDisplay></SupplyDisplay>
    </div>
    <div class="wrapper">
      <div class="header_text">
        <div class="header_text_title">
          <div class="header_text_title_top">
            RAFFLES <span class="sub_title">- The KNIVES</span>
          </div>
          <div class="header_text_title_bot">
            All the raffles in Knives Legacy
          </div>
        </div>
        <a
          class="header_text_info zoom"
          href="https://docs.knives-legacy.io/the-knives-collection/the-armory-knives-mecanics/on-chain-raffle"
          target="_blank"
        >
          More Info
          <img src="@/assets/info.png" alt="Info Icon" id="info_icon" />
        </a>
      </div>
      <div class="divider"></div>
      <RaffleInfo :raffle="true" v-on:selectFilter="applyFilter"></RaffleInfo>
      <RaffleTable
        :raffles="
          displayedRaffles.filter((raffle) => {
            if (filter === 'all') return true;
            else return raffle.status === filter;
          })
        "
      ></RaffleTable>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SupplyDisplay from "@/components/SupplyDisplay.vue";
import Connect from "@/components/Connect.vue";
import RaffleInfo from "@/components/RaffleInfo.vue";
import RaffleTable from "@/components/RaffleTable.vue";
import { MutationPayload } from "vuex";
import { RaffleActions } from "@/store/modules/raffle/actions";
import { ConnectorMutations } from "@/store/modules/connector/mutations";
import { ApproveActions } from "@/store/modules/approve/actions";

@Component({
  components: {
    RaffleTable,
    RaffleInfo,
    SupplyDisplay,
    Connect,
  },
  computed: {
    displayedRaffles(): Raffle[] {
      return this.$store.state.raffle.displayedRaffles;
    },
  },
})
export default class Raffle extends Vue {
  filter = "all";
  unsubscribe: () => void = () => null;

  /***
   * Initialize the component, and subscribe to the store to update the data
   * @returns {void}
   */
  mounted(): void {
    // All the user can see the displayed raffles
    this.$store.dispatch(RaffleActions.GET_DISPLAYED_RAFFLES);
    if (this.$store.state.connector.account) {
      this.$store.dispatch(ApproveActions.GET_RAFFLE_TICKET_CONTRACT_APPROVAL);
    }
    this.unsubscribe = this.$store.subscribe((mutation: MutationPayload) => {
      if (
        mutation.type === ConnectorMutations.SET_ACCOUNT &&
        mutation.payload
      ) {
        this.$store.dispatch(RaffleActions.GET_DISPLAYED_RAFFLES);
        this.$store.dispatch(
          ApproveActions.GET_RAFFLE_TICKET_CONTRACT_APPROVAL
        );
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
   * Apply filter to raffles
   * @param {string} filter
   * @returns {void}
   */
  applyFilter(filter: string): void {
    this.filter = filter;
  }
}
</script>

<style scoped lang="scss">
#Raffle {
  height: 100%;
  width: 100%;
  max-height: 100vh;
  background: url("~@/assets/staking_filter.webp"),
    url("~@/assets/staking_bg.webp");
  background-size: cover;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;

  .info_wrapper {
    display: flex;
    flex-direction: row-reverse;
    column-gap: 20px;
    margin-right: 20px;
    @media screen and (max-width: 640px) {
      column-gap: 10px;
      margin-right: 5px;
      margin-left: 5px;
    }
  }

  .wrapper {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    @media screen and (max-width: 825px) {
      width: 95%;
    }
    .header_text {
      display: flex;
      font-family: "Space Grotesk", sans-serif;
      font-weight: bold;
      align-items: center;
      &_title {
        color: white;
        font-size: 26px;
        margin-right: 40px;
        @media screen and (max-width: 500px) {
          font-size: 22px;
          margin-right: 15px;
        }
      }

      &_title_top {
        .sub_title {
          color: rgba(239, 239, 239, 0.8);
          font-size: 22px;
          @media screen and (max-width: 500px) {
            font-size: 18px;
          }
        }
      }

      &_title_bot {
        color: rgba(239, 239, 239, 0.8);
        font-size: 18px;
        @media screen and (max-width: 500px) {
          font-size: 14px;
        }
      }

      &_info {
        text-decoration: none;
        display: flex;
        height: fit-content;
        align-items: center;
        color: rgba(239, 239, 239, 0.8);
        font-size: 14px;
        background-color: #cc9932;
        border-radius: 10px;
        padding: 10px 20px;
        cursor: pointer;
        @media screen and (max-width: 500px) {
          font-size: 12px;
          padding: 5px 9px;
        }

        #info_icon {
          color: white;
          height: 20px;
          width: 20px;
          margin-left: 5px;
        }
      }
    }

    .divider {
      height: 1px;
      width: 100%;
      background-color: #515151;
      margin-top: 20px;
      margin-bottom: 15px;
    }
  }
}
</style>
