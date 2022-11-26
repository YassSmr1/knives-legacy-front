import { Moment } from "moment";

export interface Knife {
  id: number;
  image: string;
}

export interface Raffle {
  id: number;
  projectName: string;
  imageUrl: string;
  type: string;
  price: string;
  erc20prices: string[];
  erc20address: string[];
  erc20names: string[];
  mintFee: string;
  maxTickets: number;
  maxTicketsPerWallet: number;
  winnersAmount: number;
  startDate: Moment;
  endDate: Moment;
  status: string;
  participants: string[];
  winners: string[];
  twitter: string;
  discord: string;
  network: string;
  nftPrice: string;
  mintTimestamp: Moment;
  currentEntries: number;
}
