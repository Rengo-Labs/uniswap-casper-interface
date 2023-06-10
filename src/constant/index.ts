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