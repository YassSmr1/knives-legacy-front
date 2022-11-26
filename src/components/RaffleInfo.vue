<template>
  <div id="RaffleInfo">
    <div class="grid">
      <div
        class="column selected"
        v-on:click="select('all')"
        id="all_raffle_info"
      >
        <div class="column_value" style="background-color: #996633">
          {{
            raffle
              ? displayedRaffles.length
              : displayedRaffles.filter((item) => {
                  return item.participants.some(
                    (participant) =>
                      participant.toLowerCase() === account.toLowerCase()
                  );
                }).length
          }}
        </div>
        <div class="column_text">
          All {{ raffle ? "raffles" : "participations" }}
        </div>
      </div>
      <div class="column" v-on:click="select('open')" id="open_raffle_info">
        <div class="column_value" style="background-color: #339933">
          {{
            raffle
              ? displayedRaffles.filter(
                  (raffleItem) => raffleItem.status === "open"
                ).length
              : displayedRaffles
                  .filter((item) => {
                    return item.participants.some(
                      (participant) =>
                        participant.toLowerCase() === account.toLowerCase()
                    );
                  })
                  .filter((item) => item.status === "open").length
          }}
        </div>
        <div class="column_text">
          {{ raffle ? "Currently open" : "On-going participations" }}
        </div>
      </div>
      <div
        class="column"
        v-if="raffle"
        v-on:click="select('soon')"
        id="soon_raffle_info"
      >
        <div class="column_value" style="background-color: #663399">
          {{
            raffle
              ? displayedRaffles.filter(
                  (raffleItem) => raffleItem.status === "soon"
                ).length
              : displayedRaffles
                  .filter((item) => {
                    return item.participants.some(
                      (participant) =>
                        participant.toLowerCase() === account.toLowerCase()
                    );
                  })
                  .filter((item) => item.status === "soon").length
          }}
        </div>
        <div class="column_text">Soon</div>
      </div>
      <div class="column" v-on:click="select('close')" id="close_raffle_info">
        <div class="column_value" style="background-color: #3333cc">
          {{
            raffle
              ? displayedRaffles.filter(
                  (raffleItem) => raffleItem.status === "close"
                ).length
              : displayedRaffles
                  .filter((item) => {
                    return item.participants.some(
                      (participant) =>
                        participant.toLowerCase() === account.toLowerCase()
                    );
                  })
                  .filter((item) => item.status === "close").length
          }}
        </div>
        <div class="column_text">
          {{ raffle ? "Finished" : "Closed participations" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Raffle from "@/components/Raffle.vue";

@Component({
  components: {},
  computed: {
    displayedRaffles(): Raffle[] {
      return this.$store.state.raffle.displayedRaffles;
    },
    account(): string {
      return this.$store.state.connector.account;
    },
  },
})
export default class RaffleInfo extends Vue {
  @Prop() raffle!: boolean;

  /***
   * Emit the event to filter the rafflles and add the selected class to the selected element
   * @param {string} filter
   * @returns {void}
   */
  select(filter: string): void {
    this.$emit("selectFilter", filter);
    const elements = document.querySelectorAll("#RaffleInfo .column");
    const selected = document.getElementById(filter + "_raffle_info");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("selected");
    }
    selected?.classList.add("selected");
  }
}
</script>

<style scoped lang="scss">
#RaffleInfo {
  display: flex;
  flex-direction: row;

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    @media screen and (max-width: 630px) {
      grid-template-rows: repeat(2, 1fr);
      grid-template-columns: repeat(2, 1fr);
      place-items: center;
      row-gap: 10px;
    }
    column-gap: 10px;
    cursor: pointer;

    .column {
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #2c2c2c;
      color: #bbbbbb;
      padding: 5px 30px 5px 20px;
      @media screen and (max-width: 1074px) {
        padding: 5px 10px 5px 20px;
      }
      @media screen and (max-width: 441px) {
        padding: 5px 10px 5px 10px;
      }
      width: 100%;
      font-family: "Space Grotesk", sans-serif;
      border-radius: 15px;

      &_value {
        border-radius: 5px;
        margin-right: 10px;
        padding: 5px 10px;
      }

      &_text {
        font-size: 14px;
        @media screen and (max-width: 441px) {
          font-size: 12px;
        }
        font-weight: bold;
      }

      &.selected {
        background-color: #444444;
        border-right: solid 8px #993333;
      }

      &:hover {
        background-color: #444444;
      }
    }
  }
}
</style>
