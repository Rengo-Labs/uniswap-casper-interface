export const NODE_ADDRESS = process.env.REACT_APP_NODE_ADDRESS;
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const DEADLINE = parseInt(process.env.REACT_APP_DEADLINE);
export const FACTORY_CONTRACT =
  "a0f8026f753c60e540ba08f02621fb9027582285d871dde0f3daa5e84462f9b9";
export const FACTORY_CONTRACT_PACKAGE =
  "f329330b99110d9f8589b8a94f0e5b3c4cd5e1710fb443d04472682ae9b212d0";
export const ROUTER_CONTRACT_HASH = process.env.REACT_APP_ROUTER_CONTRACT_HASH;
export const ROUTER_PACKAGE_HASH = process.env.REACT_APP_ROUTER_PACKAGE_HASH;
export const WRAPPED_CASPER_CONTRACT_HASH =
  "hash-238834bc76aed9e18ad0260e65d2ef751999c97c13da92dee83bd511e31e2d2d";
export const CHAINS = {
  CASPER_MAINNET: "casper",
  CASPER_TESTNET: "casper-test",
};
export const SUPPORTED_NETWORKS = {
  blockExplorerUrl: process.env.REACT_APP_BLOCK_EXPLORER_URL,
  chainId: process.env.REACT_APP_CHAIN_ID,
  displayName: process.env.REACT_APP_DISPLAY_NAME,
  logo: process.env.REACT_APP_LOGO,
  rpcTarget: process.env.REACT_APP_RPC_TARGET,
  ticker: process.env.REACT_APP_TICKER,
  tickerName: process.env.REACT_APP_TICKER_NAME,
  networkKey: process.env.REACT_APP_NETWORK_KEY
};