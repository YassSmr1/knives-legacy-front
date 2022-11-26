import { RaffleState } from "@/store/modules/raffle/types";
import { ActionTree } from "vuex";
import { RootState } from "@/store/types";
import {
  getConnectedContract,
  handleError,
  handleTxResults,
  sortRaffle,
} from "@/store/utils";
import Addresses from "@/assets/addresses.json";
import IRaffleTicket from "@/assets/IRaffleTicket.json";
import { Raffle } from "@/types/Interface";
import { BigNumber, ethers } from "ethers";
import moment from "moment";
import { RaffleMutation } from "@/store/modules/raffle/mutations";
import { LoaderMutation } from "@/store/modules/loader/mutations";
import { SupplyActions } from "@/store/modules/supply/actions";
import { SupplyMutation } from "@/store/modules/supply/mutations";
import { RPC_URL } from "@/config";

export enum RaffleActions {
  GET_DISPLAYED_RAFFLES = "GET_DISPLAYED_RAFFLES",
  BUY_RAFFLE_TICKET = "BUY_RAFFLE_TICKET",
  BUY_RAFFLE_TICKET_WITH_ERC20 = "BUY_RAFFLE_TICKET_WITH_ERC20",
}

export const actions: ActionTree<RaffleState, RootState> = {
  async [RaffleActions.GET_DISPLAYED_RAFFLES]({ commit }) {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(
      Addresses.raffleTicket,
      IRaffleTicket,
      provider
    );
    const result = await contract.getDisplayedRaffles();
    let formattedResult = [] as Raffle[];
    for (let i = 0; i < result[0].length; i++) {
      const startDate = moment.utc(
        result[0][i].open_timestamp.toNumber() * 1000
      );
      const endDate = moment.utc(
        result[0][i].close_timestamp.toNumber() * 1000
      );
      const mintTimestamp = moment.utc(
        result[1][i].mint_timestamp.toNumber() * 1000
      );
      let status = "open";
      if (startDate.isAfter(moment.utc())) {
        status = "soon";
      } else if (endDate.isBefore(moment.utc())) {
        status = "close";
      }
      formattedResult.push({
        id: result[0][i].raffle_id.toNumber(),
        projectName: result[0][i].project_name,
        imageUrl: result[0][i].image_url,
        type: result[0][i].raffle_type,
        price: ethers.utils.formatEther(result[0][i].price),
        mintFee: ethers.utils.formatEther(result[0][i].mint_fee),
        maxTickets: result[0][i].max_ticket.toNumber(),
        maxTicketsPerWallet: result[0][i].max_ticket_wallet.toNumber(),
        winnersAmount: result[0][i].winners_amount,
        erc20address: result[0][i].erc20address,
        erc20prices: result[0][i].erc20prices.map((price: BigNumber) =>
          ethers.utils.formatEther(price)
        ),
        erc20names: result[0][i].erc20names,
        startDate,
        endDate,
        status,
        participants: result[2][i].participants,
        winners: result[2][i].winners,
        twitter: result[1][i].twitter_url,
        discord: result[1][i].discord_url,
        network: result[1][i].network,
        nftPrice: ethers.utils.formatEther(result[1][i].nft_price),
        mintTimestamp,
        currentEntries: result[0][i].current_entries.toNumber(),
      });
    }

    formattedResult = sortRaffle(formattedResult);
    commit(RaffleMutation.SET_DISPLAYED_RAFFLES, formattedResult);
  },
  async [RaffleActions.BUY_RAFFLE_TICKET](
    { commit, rootState, dispatch },
    data: {
      raffleId: number;
      amount: number;
      mintFee: number;
    }
  ) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    try {
      const options = {
        value: ethers.utils
          .parseEther(data.mintFee.toString())
          .mul(data.amount),
      };
      const contract = getConnectedContract(
        Addresses.raffleTicket,
        IRaffleTicket,
        rootState.connector.web3Provider
      );
      const tx = await contract.safeMint(data.raffleId, data.amount, options);
      if (
        await handleTxResults(
          tx,
          commit,
          "You have successfully bought " + data.amount + " tickets !"
        )
      ) {
        const raffles = rootState.raffle.displayedRaffles;
        const raffle = raffles.find((raffle) => raffle.id === data.raffleId);
        if (raffle) {
          let supply = parseFloat(rootState.supply.supplyWallet);
          const price = parseFloat(raffle.price) * data.amount;
          supply = supply - price;
          commit(SupplyMutation.SET_SUPPLY_WALLET, supply.toFixed(2));
        }
      } else {
        dispatch(RaffleActions.GET_DISPLAYED_RAFFLES);
        dispatch(SupplyActions.GET_SUPPLY_WALLET);
      }
      commit(LoaderMutation.SET_LOADING, false);
    } catch (e) {
      handleError(e, commit);
      return false;
    }
    return true;
  },
  async [RaffleActions.BUY_RAFFLE_TICKET_WITH_ERC20](
    { commit, rootState, dispatch },
    data: {
      raffleId: number;
      amount: number;
      mintFee: number;
      index: number;
    }
  ) {
    if (!rootState.connector.web3Provider) throw new Error("No web3 provider");
    try {
      const options = {
        value: ethers.utils
          .parseEther(data.mintFee.toString())
          .mul(data.amount),
      };
      const contract = getConnectedContract(
        Addresses.raffleTicket,
        IRaffleTicket,
        rootState.connector.web3Provider
      );
      const tx = await contract.safeMintErc20(
        data.raffleId,
        data.amount,
        data.index,
        options
      );
      if (
        !(await handleTxResults(
          tx,
          commit,
          "You have successfully bought " + data.amount + " tickets !"
        ))
      ) {
        dispatch(RaffleActions.GET_DISPLAYED_RAFFLES);
        dispatch(SupplyActions.GET_SUPPLY_WALLET);
      }
      commit(LoaderMutation.SET_LOADING, false);
    } catch (e) {
      handleError(e, commit);
      return false;
    }
    return true;
  },
};
