import { Wallet, WalletName } from '../../commons/wallet'

export type ConfigState = {
  isConnected?: boolean,
  wallet?: Wallet,
  walletAddress?: string,
  mainPurse?: string,
  walletSelected?: WalletName,
  languagesSelected?: string,
  visualModeSelected?: string,
  slippageToleranceSelected?: number,
  gasPriceSelectedForSwapping?: number,
  gasPriceSelectedForLiquidity?: number
}

export const initialConfigState: ConfigState = {
  isConnected: false,
  wallet: undefined,
  walletAddress: "",
  mainPurse: "",
  walletSelected: WalletName.CASPER_SIGNER,
  languagesSelected: process.env.REACT_APP_LANGUAGE_SELECTED,
  visualModeSelected: process.env.REACT_APP_VISUAL_MODEL_SELECTED,
  slippageToleranceSelected: parseInt(process.env.REACT_APP_VISUAL_MODEL_SELECTED),
  gasPriceSelectedForSwapping: parseInt(process.env.REACT_APP_SLIPPAGE_TOLERANCE_FOR_SWAPPING),
  gasPriceSelectedForLiquidity: parseInt(process.env.REACT_APP_SLIPPAGE_TOLERANCE_FOR_LIQUIDITY)
};

export enum ConfigActions {
  CONNECT_WALLET = "CONNECT_WALLET",
  DISCONNECT_WALLET = "DISCONNECT_WALLET",
  SELECT_WALLET = "SELECT_WALLET",
  SELECT_LANGUAGE = "SELECT_LANGUAGE",
  SELECT_VISUAL_MODE = "SELECT_VISUAL_MODE",
  SELECT_SLIPPAGE = "SELECT_SLIPPAGE",
  SELECT_GAS_PRICE = "SELECT_GAS_PRICE",
  SELECT_MAIN_PURSE = "SELECT_MAIN_PURSE",
}

export type ConfigAction = {
  type: ConfigActions,
  payload: ConfigState,
}

export function ConfigReducer(state: ConfigState, action: ConfigAction) {
  switch (action.type) {
    case ConfigActions.CONNECT_WALLET:
      return {
        ...state,
        isConnected: action.payload.wallet.isConnected,
        walletAddress: action.payload.wallet.publicKeyHex,
        //walletSelected: action.payload.wallet.name,
        wallet: action.payload.wallet,
      };
    case ConfigActions.DISCONNECT_WALLET:
      return {
        ...state,
        isConnected: false,
        walletAddress: "",
        //walletSelected: undefined,
        wallet: undefined,
      };
    /*case ConfigActions.SELECT_WALLET:
      return {
        ...state,
        walletSelected: action.payload.walletSelected,
      };*/
    case ConfigActions.SELECT_LANGUAGE:
      return {
        ...state,
        languagesSelected: action.payload.languagesSelected,
      };
    case ConfigActions.SELECT_VISUAL_MODE:
      return {
        ...state,
        visualModeSelected: action.payload.visualModeSelected,
      };
    case ConfigActions.SELECT_SLIPPAGE:
      return {
        ...state,
        slippageToleranceSelected: action.payload.slippageToleranceSelected,
      };
    /* case ConfigActions.SELECT_SLIPPAGE:
      return {
        ...state,
        gasPriceSelected: action.payload.gasPriceSelected,
      }; */
    case ConfigActions.SELECT_MAIN_PURSE:
      return {
        ...state,
        mainPurse: action.payload.mainPurse,
      };
    default:
      return { ...state };
  }
}
