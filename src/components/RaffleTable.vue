<template>
  <div id="RaffleTable">
    <div class="header">
      <div class="header_name">RAFFLES</div>
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
          id="all_raffle_table"
          >ALL</span
        >
        &nbsp;/&nbsp;
        <span
          class="filter"
          v-on:click="selectFilter('nft')"
          id="nft_raffle_table"
          >NFT</span
        >
        &nbsp;/&nbsp;
        <span
          class="filter"
          v-on:click="selectFilter('whitelist')"
          id="whitelist_raffle_table"
          >WHITELIST</span
        >
      </div>
    </div>
    <div class="body">
      <RaffleTile
        v-for="raffle in raffles.filter((raffleItem) => {
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
        :key="raffle.id"
        :raffle="raffle"
      ></RaffleTile>
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
})
export default class RaffleTable extends Vue {
  @Prop() raffles!: Raffle[];
  filter = "all";
  search = "";

  /***
   * Filter the raffle table by type and add the selected class to the selected element
   * @param {string} filter
   * @returns {void}
   */
  selectFilter(filter: string): void {
    this.filter = filter;
    const elements = document.querySelectorAll("#RaffleTable .filter");
    const selected = document.getElementById(filter + "_raffle_table");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("selected");
    }
    selected?.classList.add("selected");
  }
}
</script>

<style scoped lang="scss">
#RaffleTable {
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
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    column-gap: 15px;
    row-gap: 15px;
    @media screen and (max-width: 660px) {
      justify-content: center;
    }
  }
}
</style>
