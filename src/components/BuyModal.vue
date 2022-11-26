<template>
  <modal
    :name="'buy_' + raffle.id"
    width="450px"
    height="auto"
    :adaptive="true"
    classes="modal_buy"
  >
    <div class="grid">
      <div class="title">CONFIRM YOUR TRANSACTION</div>
      <div class="text">
        <p>
          By buying ticket(s) for this raffle,
          <strong>I confirm that I have done my own research</strong> on the
          project linked to it.
        </p>
        <p>
          Knives Legacy and its team couldn’t be taken accountable for any loss
          or problem occuring with this project as it isn’t a financial advice
          and
          <strong
            >KL have no involvment in the development of this project</strong
          >.
        </p>
        <p>
          The raffle provide a chance for me to acquire an entry to another
          project and the decision to do a financial transaction with them in
          the end depends solely on my own decision.
        </p>
      </div>
      <div class="info">
        <strong
          >{{ tickets }} ticket(s) for {{ price }} ${{
            selected === "" ? "SUPPLY" : selected
          }}
          + {{ Number((raffle.mintFee * tickets).toFixed(4)) }} $AVAX platform
          fees</strong
        >
        <br />for {{ raffle.projectName }} raffle.
      </div>
      <div class="buttons">
        <button class="cancel zoom" @click="closeModal">CANCEL</button>
        <button class="buy zoom" @click="buy">BUY</button>
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
export default class BuyModal extends Vue {
  @Prop() raffle!: Raffle;
  @Prop() price!: number;
  @Prop() selected!: string;
  @Prop() buyFunction!: () => Promise<void>;
  @Prop() tickets!: number;

  /***
   * Close the modal and trigger the buy function
   * @returns {void}
   */
  buy(): void {
    this.closeModal();
    this.buyFunction();
  }

  /***
   * Close the modal
   * @returns {void}
   */
  closeModal(): void {
    this.$modal.hide("buy_" + this.raffle.id);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.modal_buy {
  font-family: "Space Grotesk", sans-serif;
  padding: 40px;
  background-color: #333333 !important;
  color: white;
  @media screen and (max-width: 600px) {
    padding: 15px;
  }

  .grid {
    display: grid;
    grid-template-rows: auto auto auto auto;
    row-gap: 20px;

    .title {
      font-size: 18px;
      @media screen and (max-width: 600px) {
        font-size: 16px;
      }
      font-weight: bold;
    }

    p {
      font-size: 16px;
      @media screen and (max-width: 600px) {
        font-size: 14px;
      }
      margin-bottom: 10px;
    }

    .info {
      padding: 10px;
      border: solid 2px white;
      text-align: center;
    }

    .buttons {
      display: grid;
      grid-template-columns: auto auto;
      column-gap: 15px;
      button {
        color: white;
        font-weight: bold;
        padding: 10px;
        margin: 0 10px;
        cursor: pointer;
        border: none;
        border-radius: 15px;
      }

      .cancel {
        background-color: #666666;
      }

      .buy {
        background-color: #339933;
      }
    }
  }

  .green {
    color: #349533;
  }
}
</style>
