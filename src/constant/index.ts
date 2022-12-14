export const NODE_ADDRESS =
  "https://cps8d206t1.execute-api.us-east-1.amazonaws.com/?url=http://44.208.234.65:7777/rpc";
export const BASE_URL = `
  //graphqlbackendfinalized-env.eba-n4mfh6c2.us-east-1.elasticbeanstalk.com`;
export const DEADLINE = 1739598100811;
export const FACTORY_CONTRACT =
  "a0f8026f753c60e540ba08f02621fb9027582285d871dde0f3daa5e84462f9b9";
export const FACTORY_CONTRACT_PACKAGE =
  "f329330b99110d9f8589b8a94f0e5b3c4cd5e1710fb443d04472682ae9b212d0";
export const ROUTER_CONTRACT_HASH =
  "2bd3b33f9d0a137a5790ebf0091d6bb5e0f47df6b7ca783989df8490c35875c7";
export const ROUTER_PACKAGE_HASH =
  "ea048572fa8c13b56b58d512d9f3757823e42b74ad3273812ead895df6474d9d";
export const WRAPPED_CASPER_CONTRACT_HASH =
  "hash-238834bc76aed9e18ad0260e65d2ef751999c97c13da92dee83bd511e31e2d2d";
export const CHAINS = {
  CASPER_MAINNET: "casper",
  CASPER_TESTNET: "casper-test",
};
export const SUPPORTED_NETWORKS = {
  [CHAINS.CASPER_MAINNET]: {
    blockExplorerUrl: "https://cspr.live",
    chainId: "0x1",
    displayName: "Casper Mainnet",
    logo: "https://cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: CHAINS.CASPER_MAINNET,
  },
  [CHAINS.CASPER_TESTNET]: {
    blockExplorerUrl: "https://testnet.cspr.live",
    chainId: "0x2",
    displayName: "Casper Testnet",
    logo: "https://testnet.cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://testnet.casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: CHAINS.CASPER_TESTNET,
  },
};