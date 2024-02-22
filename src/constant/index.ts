export const NODE_ADDRESSES = process.env.REACT_APP_NODE_ADDRESSES;
export const NODE_PROXY = process.env.REACT_APP_NODE_PROXY
// export const NODE_ADDRESS = NODE_PROXY + NODE_ADDRESSES[Math.floor(Math.random() * NODE_ADDRESSES.length)]
export const NODE_ADDRESS = NODE_PROXY + NODE_ADDRESSES
export const DEADLINE = parseInt(process.env.REACT_APP_DEADLINE);
export const ROUTER_CONTRACT_HASH = process.env.REACT_APP_ROUTER_CONTRACT_HASH;
export const ROUTER_PACKAGE_HASH = process.env.REACT_APP_ROUTER_PACKAGE_HASH;
export const INFO_SWAP_URL = process.env.REACT_APP_INFO_SWAP_URL;
export const INFO_BLOCK_URL = process.env.REACT_APP_INFO_BLOCK_URL;
export const API_BLOCKCHAIN_INFO = process.env.REACT_APP_API_BLOCKCHAIN_INFO;

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

export const PLATFORM_GAS_FEE = parseFloat(process.env.REACT_APP_SITE_GAS_FEE) + parseFloat(process.env.REACT_APP_DEVELOPERS_GAS_FEE)
export const TWITTER_URL = process.env.REACT_APP_TWITTER_URL;
export const DISCORD_URL = process.env.REACT_APP_DISCORD_URL;
export const TELEGRAM_URL = process.env.REACT_APP_TELEGRAM_URL;
export const GITBOOK_URL = process.env.REACT_APP_GITBOOK_URL;
export const MEDIUM_URL = process.env.REACT_APP_MEDIUM;
export const CSPR_NETWORK_URL = process.env.REACT_APP_CSPR_NETWORK_URL

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Loading = 'loading'
}

export enum MenuMobileOptions {
  Settings = 'Settings',
  Community = 'Community',
}

export const LIQUIDITY_GAUGE_V3_CONTRACT_HASH = process.env.REACT_APP_LIQUIDITY_GAUGE_V3_CONTRACT_HASH
export const LIQUIDITY_GAUGE_V3_PACKAGE_HASH = process.env.REACT_APP_LIQUIDITY_GAUGE_V3_PACKAGE_HASH
export const GAS_FEE_FOR_GAUGE_STAKE = process.env.REACT_APP_GAS_FEE_FOR_GAUGE_STAKE
export const GAS_FEE_FOR_GAUGE_UNSTAKE = process.env.REACT_APP_GAS_FEE_FOR_GAUGE_UNSTAKE
export const GAS_FEE_FOR_GAUGE_CLAIM = process.env.REACT_APP_GAS_FEE_FOR_GAUGE_CLAIM
export const GAS_PRICE_FOR_APPROVAL = process.env.REACT_APP_GAS_PRICE_FOR_APPROVAL

export const CST_MINTER_CONTRACT_HASH = process.env.REACT_APP_CST_MINTER_CONTRACT_HASH
export const CST_MINTER_PACKAGE_HASH = process.env.REACT_APP_CST_MINTER_PACKAGE_HASH
export const GAS_FEE_FOR_CST_CLAIM = process.env.REACT_APP_GAS_FEE_FOR_CST_CLAIM

export const REWARD_TOKEN_WEEKLY_EMISSIONS = process.env.REACT_APP_REWARD_TOKEN_WEEKLY_EMISSIONS
export const REWARD_CST_WEEKLY_INFLATION_RATE = process.env.REACT_APP_REWARD_CST_WEEKLY_INFLATION_RATE

export const APR_AMOUNT_WEEKS= parseInt(process.env.REACT_APP_APR_AMOUNT_WEEKS)
export const TOTAL_GAUGE_WEIGHT_FOR_CST = parseInt(process.env.REACT_APP_TOTAL_GAUGE_WEIGHT_FOR_CST)
export const GEOLOCATION_URL = process.env.REACT_APP_GEOLOCATION_URL
export const TOKEN_SYMBOL_GAUGE = process.env.REACT_APP_TOKEN_SYMBOL_GAUGE