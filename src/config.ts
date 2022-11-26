const MAINNET = true;
export const CHAIN_ID = MAINNET ? 43114 : 43113;
export const KNIFE_URI = "https://kniveslegacy.s3.amazonaws.com/images/";
export const RPC_URL = MAINNET
  ? "https://api.avax.network/ext/bc/C/rpc"
  : "https://api.avax-test.network/ext/bc/C/rpc";
