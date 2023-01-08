export const NODE_ADDRESS = process.env.REACT_APP_NODE_ADDRESS;
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const DEADLINE = parseInt(process.env.REACT_APP_DEADLINE);
export const ROUTER_CONTRACT_HASH = process.env.REACT_APP_ROUTER_CONTRACT_HASH;
export const ROUTER_PACKAGE_HASH = process.env.REACT_APP_ROUTER_PACKAGE_HASH;

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

export const TWITTER_URL = process.env.REACT_APP_TWITTER_URL;
export const DISCORD_URL = process.env.REACT_APP_DISCORD_URL;
export const TELEGRAM_URL = process.env.REACT_APP_TELEGRAM_URL;
export const GITBOOK_URL = process.env.REACT_APP_GITBOOK_URL;


export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Loading = 'loading'
}