<template>
  <div id="KnivesStaking">
    <div class="info_wrapper">
      <Connect></Connect>
      <SupplyDisplay></SupplyDisplay>
    </div>
    <div class="banner_wrapper">
      <div class="banner_wrapper_box">
        <div class="banner_wrapper_title">STAKE YOUR NFTS</div>
        <div class="banner_wrapper_sub">
          1 staked knife produce <br />
          200 $SUPPLY / day
        </div>
        <a
          class="banner_wrapper_link"
          target="_blank"
          href="https://docs.knives-legacy.io/the-knives-collection/the-armory-knives-mecanics/staking"
          rel="noreferrer"
          >Stake infos on the whitepaper ℹ</a
        >
      </div>
    </div>
    <div class="collection_grid">
      <div class="collection_title" id="title_knives">Your NFTs</div>
      <div class="collection_title" id="title_staked">Staked</div>
      <div class="grid_collection knives_collection">
        <img
          v-for="(knife, index) in knives"
          class="knife_image"
          :src="knife.image"
          :alt="'Knife_' + knife.id"
          :key="index"
          v-on:click="selectKnife(knife)"
          :class="selectedKnife.includes(knife) ? 'selected' : ''"
        />
        <div class="btn_wrapper" id="deposit">
          <button
            class="btn_action zoom"
            v-if="
              !loading &&
              account &&
              knivesStakingContractApproved &&
              selectedKnife.length > 0
            "
            v-on:click="triggerDeposit"
          >
            Deposit {{ selectedKnife.length > 1 ? "all" : "" }}
          </button>
          <button
            class="btn_action zoom"
            v-if="!loading && account && !knivesStakingContractApproved"
            v-on:click="triggerApprove"
          >
            Approve
          </button>
          <Loader v-if="loading"></Loader>
        </div>
      </div>
      <div class="grid_collection staked_collection">
        <img
          v-for="(knife, index) in stakedKnives"
          class="knife_image"
          :src="knife.image"
          :alt="'Knife_' + knife.id"
          :key="index"
          v-on:click="selectStakedKnife(knife)"
          :class="stakedSelectedKnife.includes(knife) ? 'selected' : ''"
        />
        <div class="btn_wrapper" id="withdraw">
          <button
            class="btn_action zoom"
            v-if="
              !loading &&
              account &&
              knivesStakingContractApproved &&
              stakedSelectedKnife.length > 0
            "
            v-on:click="triggerWithdraw"
          >
            Withdraw {{ stakedSelectedKnife.length > 1 ? "all" : "" }}
          </button>
          <div
            style="margin-left: 10px"
            class="btn_action zoom"
            v-if="
              !loading &&
              account &&
              knivesStakingContractApproved &&
              claimableSupply > 0
            "
            v-on:click="triggerClaim"
          >
            Claim : {{ claimableSupply }} $SUPPLY
          </div>
          <button
            class="btn_action zoom"
            v-if="!loading && account && !knivesStakingContractApproved"
            v-on:click="triggerApprove"
          >
            Approve
          </button>
          <Loader v-if="loading"></Loader>
        </div>
      </div>
    </div>
    <div class="footer_staking">
      <img src="@/assets/footer_line.webp" alt="Staking logo" />
      <div class="footer_staking_text">
        <img src="@/assets/staking_router.webp" alt="Staking logo" />
        Stake
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Loader from "@/components/Loader.vue";
import { MutationPayload } from "vuex";
import { Knife } from "@/types/Interface";
import Connect from "@/components/Connect.vue";
import SupplyDisplay from "@/components/SupplyDisplay.vue";
import { ApproveActions } from "@/store/modules/approve/actions";
import { KnifeActions } from "@/store/modules/knife/actions";
import { StakingKnifeActions } from "@/store/modules/stakingKnife/actions";
import { ConnectorMutations } from "@/store/modules/connector/mutations";
import { LoaderMutation } from "@/store/modules/loader/mutations";

@Component({
  components: { SupplyDisplay, Connect, Loader },
  computed: {
    knives(): Knife[] {
      return this.$store.state.knife.knives;
    },
    loading(): boolean {
      return this.$store.state.loader.loading;
    },
    knivesStakingContractApproved(): boolean {
      return this.$store.state.approve.knivesStakingContractApproved;
    },
    stakedKnives(): Knife[] {
      return this.$store.state.stakingKnife.stakedKnives;
    },
    claimableSupply(): string {
      return this.$store.state.stakingKnife.claimableSupply;
    },
    account: function () {
      return this.$store.state.connector.account;
    },
  },
})
export default class KnivesStaking extends Vue {
  unsubscribe: () => void = () => null;
  selectedKnife: Knife[] = [];
  stakedSelectedKnife: Knife[] = [];

  /***
   * Initialize the component if the user is connected, and subscribe to the store to update the data
   * @returns {void}
   */
  mounted(): void {
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
   * Dispatch the action to update the data used in the component
   * @returns {void}
   */
  init(): void {
    this.$store.dispatch(ApproveActions.GET_KNIVES_STAKING_CONTRACT_APPROVAL);
    this.$store.dispatch(KnifeActions.GET_KNIFE);
    this.$store.dispatch(StakingKnifeActions.GET_STAKING_KNIVES);
    this.$store.dispatch(StakingKnifeActions.GET_CLAIMABLE_SUPPLY);
  }

  /***
   * Dispatch the action to approve the knives staking contract
   * @returns {Promise<void>}
   */
  async triggerApprove(): Promise<void> {
    this.$store.commit(LoaderMutation.SET_LOADING, true);
    await this.$store.dispatch(ApproveActions.APPROVE_KNIVES_STAKING_CONTRACT);
  }

  /***
   * Dispatch the action to deposit the selected knives
   * @returns {Promise<void>}
   */
  async triggerDeposit(): Promise<void> {
    this.$store.commit(LoaderMutation.SET_LOADING, true);
    await this.$store.dispatch(
      StakingKnifeActions.DEPOSIT_ALL_KNIVES,
      this.selectedKnife
    );
    this.selectedKnife = [];
  }

  /***
   * Dispatch the action to withdraw the selected knives
   * @returns {Promise<void>}
   */
  async triggerWithdraw(): Promise<void> {
    this.$store.commit(LoaderMutation.SET_LOADING, true);
    await this.$store.dispatch(
      StakingKnifeActions.WITHDRAW_ALL_KNIVES,
      this.stakedSelectedKnife
    );
    this.stakedSelectedKnife = [];
  }

  /***
   * Dispatch the action to claim the supply earned
   * @returns {Promise<void>}
   */
  async triggerClaim(): Promise<void> {
    this.$store.commit(LoaderMutation.SET_LOADING, true);
    await this.$store.dispatch(StakingKnifeActions.CLAIM_SUPPLY);
  }

  /***
   * Select / Remove a knife from the selected knives
   * @param {Knife} knife
   * @returns {void}
   */
  selectKnife(knife: Knife): void {
    if (this.selectedKnife.includes(knife)) {
      this.selectedKnife = this.selectedKnife.filter((k) => k.id !== knife.id);
    } else {
      this.selectedKnife.push(knife);
    }
  }

  /***
   * Select / Remove a knife from the staked selected knives
   * @param {Knife} knife
   * @returns {void}
   */
  selectStakedKnife(knife: Knife): void {
    if (this.stakedSelectedKnife.includes(knife)) {
      this.stakedSelectedKnife = this.stakedSelectedKnife.filter(
        (k) => k.id !== knife.id
      );
    } else {
      this.stakedSelectedKnife.push(knife);
    }
  }
}
</script>

<style scoped lang="scss">
#KnivesStaking {
  height: 100%;
  width: 100%;
  max-height: 100vh;
  background: url("~@/assets/staking_filter.webp"),
    url("~@/assets/staking_bg.webp");
  background-size: cover;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .selected {
    border: solid 3px white;
  }

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

  .banner_wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: auto;
    margin-right: auto;
    border-radius: 15px;
    width: 90%;
    background-size: cover !important;
    background: linear-gradient(to right, #0a080667, #0a0806fa),
      url("~@/assets/banner_staking.webp") 40% 36%;
    margin-top: 20px;
    &_box {
      width: fit-content;
      margin-right: 10%;
      margin-top: 2%;
      margin-bottom: 2%;
      @media screen and (max-width: 640px) {
        display: flex;
        flex-direction: column;
        margin-right: auto;
        margin-left: auto;
        align-items: center;
      }
    }
    &_title {
      color: #fff;
      font-family: "Space Grotesk", sans-serif;
      font-weight: bold;
      font-size: 30px;
      margin-bottom: 10px;
      @media screen and (max-width: 640px) {
        font-size: 20px;
      }
    }
    &_sub {
      color: #fff;
      font-family: "Space Grotesk", sans-serif;
      font-weight: lighter;
      font-size: 24px;
      margin-bottom: 10px;
      @media screen and (max-width: 640px) {
        font-size: 16px;
      }
    }
    &_link {
      color: #fff;
      font-family: "Space Grotesk", sans-serif;
      font-size: 24px;
      display: flex;
      align-items: center;
      cursor: pointer;
      text-decoration: none;
      @media screen and (max-width: 640px) {
        font-size: 16px;
      }
    }
  }

  .footer_staking {
    &_text {
      font-family: "Space Grotesk", sans-serif;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.4);
      font-size: 30px;
    }
    margin-top: auto;
    margin-bottom: 10px;
    margin-left: 5%;
  }

  .collection_grid {
    display: grid;
    grid-template-areas: "title_knives title_staked" "knives staked";
    grid-template-rows: auto auto;
    grid-template-columns: 1fr 1fr;
    @media screen and (max-width: 700px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto auto;
      grid-template-areas: "title_knives" "knives" "title_staked" "staked";
    }
    margin: 25px 5% 20px;
    column-gap: 45px;
    row-gap: 20px;
    .collection_title {
      color: rgba(239, 239, 239, 0.8);
      font-family: "Space Grotesk", sans-serif;
      font-size: 30px;
      font-weight: bold;
    }
    .grid_collection {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      row-gap: 10px;
      column-gap: 15px;
      align-content: flex-start;
      .knife_image {
        width: 100%;
        height: 100%;
        max-width: 100px;
        max-height: 100px;
        object-fit: cover;
      }
      .placeholder {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .grid_collection > div {
      flex: 0 1 100%;
      .loader {
        margin-top: 10px;
      }
    }
    .btn_wrapper {
      display: flex;
      align-items: center;
      .btn_action {
        color: #fff;
        border: 0;
        border-radius: 30px;
        padding: 8px 30px;
        margin-top: 15px;
        font-size: 20px;
        text-align: center;
        @media screen and (max-width: 640px) {
          font-size: 16px;
        }
        font-family: "Space Grotesk", sans-serif;
        background: rgba(121, 120, 120, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        cursor: pointer;
      }
    }
    #title_knives {
      grid-area: title_knives;
    }
    #title_staked {
      grid-area: title_staked;
    }
    #deposit {
      grid-area: deposit;
    }
    #withdraw {
      grid-area: withdraw;
    }
  }
}
</style>
