<template>
  <div id="TicketTable">
    <div class="header">
      <div class="header_name">MY PARTICIPATIONS</div>
      <div class="header_search">
        <input
          type="text"
          placeholder="Search by Raffles"
          id="search_input"
          v-model="search"
        />
      </div>
      <div class="header_sort_by">
        <div class="sort">Sort by:</div>
        <span
          class="filter selected"
          v-on:click="selectFilter('all')"
          id="all_ticket_table"
          >ALL</span
        >
        &nbsp;/&nbsp;
        <span
          class="filter"
          v-on:click="selectFilter('nft')"
          id="nft_ticket_table"
          >NFT</span
        >
        &nbsp;/&nbsp;
        <span
          class="filter"
          v-on:click="selectFilter('whitelist')"
          id="whitelist_ticket_table"
          >WHITELIST</span
        >
      </div>
    </div>
    <div class="body">
      <div class="col">Project</div>
      <div class="col">Type</div>
      <div class="col">Status</div>
      <div class="col">My Tickets</div>
      <div class="col">Total Tickets</div>
      <div class="col">Number of winners</div>
      <div class="col">Draw</div>
      <div class="col">Results</div>
      <slot
        v-for="(raffle, index) in raffles.filter((raffleItem) => {
          if (filter === 'all')
            return raffleItem.projectName
              .toLowerCase()
              .includes(search.toLowerCase());
          else
            return (
              raffleItem.type.toLowerCase() === filter &&
              raffleItem.projectName
                .toLowerCase()
                .includes(search.toLowerCase())
            );
        })"
        class="test"
      >
        <div
          class="col"
          :class="winStatus[index]"
          :key="'project_name_' + index"
        >
          {{ raffle.projectName }}
        </div>
        <div
          class="col"
          :key="'type_' + index"
          :class="raffle.type.toLowerCase() + ' ' + winStatus[index]"
        >
          {{ raffle.type.toUpperCase() }}
        </div>
        <div class="col" :class="winStatus[index]" :key="'status_' + index">
          <span
            class="status_badge"
            :class="raffle.status.toLowerCase() + ' ' + winStatus[index]"
          >
            {{ raffle.status.toUpperCase() }}
          </span>
        </div>
        <div class="col" :class="winStatus[index]" :key="'my_tickets_' + index">
          {{
            raffle.participants.filter(
              (participant) =>
                participant.toLowerCase() === account.toLowerCase()
            ).length
          }}
        </div>
        <div
          class="col"
          :class="winStatus[index]"
          :key="'total_tickets_' + index"
        >
          {{ raffle.participants.length }}
        </div>
        <div
          class="col"
          :class="winStatus[index]"
          :key="'winners_amount_' + index"
        >
          {{ raffle.winnersAmount }} max
        </div>
        <div class="col" :class="winStatus[index]" :key="'draw_' + index">
          {{ raffle.endDate.format("DD.MM.YYYY") }}
        </div>
        <div class="col" :class="winStatus[index]" :key="'winners_' + index">
          {{ winStatus[index] }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import RaffleTile from "@/components/RaffleTile.vue";
import { Prop } from "vue-property-decorator";
import { Raffle } from "@/types/Interface";

@Component({
  components: { RaffleTile },
  computed: {
    account(): string {
      return this.$store.state.connector.account;
    },
  },
})
export default class RaffleTable extends Vue {
  @Prop() raffles!: Raffle[];
  filter = "all";
  search = "";
  winStatus: string[] = [];

  /***
   * Initialize the component
   * @returns {void}
   */
  mounted(): void {
    this.selectFilter("all");
    for (const raffle of this.raffles) {
      if (raffle.status === "close" && raffle.winners.length > 0) {
        const won = raffle.winners.some(
          (winner) =>
            winner.toLowerCase() ===
            this.$store.state.connector.account.toLowerCase()
        );
        if (won) {
          this.winStatus.push("WIN");
        } else {
          this.winStatus.push("LOSE");
        }
      } else {
        this.winStatus.push("-");
      }
    }
  }

  /***
   * Select the filter and apply the selected class to the selected filter
   * @param {string} filter - The filter to apply
   * @returns {void}
   */
  selectFilter(filter: string): void {
    this.filter = filter;
    const elements = document.querySelectorAll("#TicketTable .filter");
    const selected = document.getElementById(filter + "_ticket_table");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("selected");
    }
    selected?.classList.add("selected");
  }
}
</script>

<style scoped lang="scss">
#TicketTable {
  padding-top: 20px;
  .selected {
    font-weight: bold;
  }
  .header {
    display: grid;
    grid-template-columns: 20% 50% 30%;
    @media screen and (max-width: 800px) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      place-items: center;
      padding: 10px 5%;
      row-gap: 10px;
    }
    background-color: #333333;
    padding: 20px 5%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    align-items: center;

    &_name {
      font-family: "Space Grotesk", sans-serif;
      font-weight: bold;
      font-size: 18px;
      color: #d0d0d0;
    }

    &_search {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      input {
        font-family: "Space Grotesk", sans-serif;
        font-weight: bold;
        font-size: 14px;
        width: 90%;
        padding-left: 30px;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #808080;
        background-color: #484848;
        border: none;
        border-radius: 15px;

        &:focus {
          color: white;
        }
      }
    }

    &_sort_by {
      display: flex;
      flex-direction: row;
      font-family: "Space Grotesk", sans-serif;
      color: #d0d0d0;
      justify-content: flex-end;

      .sort {
        margin-right: 10px;
      }

      .filter {
        cursor: pointer;
      }
    }
  }

  .body {
    border-left: solid 3px #242424;
    border-right: solid 3px #242424;
    border-bottom: solid 3px #242424;
    border-top: none;
    border-radius: 0 0 15px 15px;
    background-color: #121212;
    padding: 15px;
    font-family: "Space Grotesk", sans-serif;
    color: white;
    font-size: 14px;

    display: grid;
    grid-template-columns: repeat(8, auto);
    row-gap: 5px;
    overflow-y: auto;
    width: 100%;

    .LOSE {
      background-color: #5c2424;
    }

    .WIN {
      background-color: #2d3b2c;
    }

    @media screen and (max-width: 660px) {
      justify-content: center;
    }

    .col {
      border-bottom: solid 2px #262626;
      padding: 7.5px 5px;

      &:nth-child(-n + 8) {
        padding-bottom: 20px;
      }

      .status_badge {
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 5px;
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
    }
  }
}
</style>
