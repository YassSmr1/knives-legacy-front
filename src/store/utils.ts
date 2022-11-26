import {
  Contract,
  ContractInterface,
  ContractTransaction,
  ethers,
} from "ethers";
import { Commit } from "vuex";
import { ToastMutations } from "@/store/modules/toast/mutations";
import { LoaderMutation } from "@/store/modules/loader/mutations";
import { Raffle } from "@/types/Interface";

export function getConnectedContract(
  address: string,
  abi: ContractInterface,
  provider: ethers.providers.Web3Provider
): Contract {
  const signer = provider.getSigner();
  return new ethers.Contract(address, abi, signer);
}

export async function handleTxResults(
  tx: ContractTransaction,
  commit: Commit,
  message: string
): Promise<boolean> {
  const receipt = await tx.wait();
  if (receipt.status !== 1) {
    commit(ToastMutations.SET_ERROR, "Transaction error");
    return false;
  } else {
    commit(ToastMutations.SET_SUCCESS, message);
    return true;
  }
}

export function handleError(e: unknown, commit: Commit): void {
  const search = "execution reverted: ";
  if (e instanceof Error) {
    try {
      const indexOf = e.message.indexOf(search);
      const message = e.message.slice(
        indexOf + search.length,
        e.message.length
      );
      const result = message.split('"')[0];
      commit(ToastMutations.SET_ERROR, result);
    } catch (e) {
      commit(ToastMutations.SET_ERROR, "Unknown Error");
    }
  } else commit(ToastMutations.SET_ERROR, "Unknown Error");
  commit(LoaderMutation.SET_LOADING, false);
}

export function sortRaffle(raffles: Raffle[]): Raffle[] {
  const sortedRaffles: Raffle[] = [];
  let soonRaffles = raffles.filter((raffle) => raffle.status === "soon");
  let openRaffles = raffles.filter((raffle) => raffle.status === "open");
  let closeRaffles = raffles.filter((raffle) => raffle.status === "close");
  soonRaffles = soonRaffles.sort((a, b) => a.startDate.diff(b.startDate));
  openRaffles = openRaffles.sort((a, b) => a.endDate.diff(b.endDate));
  closeRaffles = closeRaffles.sort((a, b) => b.endDate.diff(a.endDate));
  sortedRaffles.push(...openRaffles, ...soonRaffles, ...closeRaffles);
  return sortedRaffles;
}
