export const initialConfigState = {
  isConnected: false,
  walletAddress: "",
  walletSelected: "casper",
  languagesSelected: "en",
  visualModeSelected: "light",
  slippageToleranceSelected: "0.5",
  gasPriceSelected: 10_000_000_000,
  mainPurse: "",
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
export function ConfigReducer(state, action) {
  switch (action.type) {
    case ConfigActions.CONNECT_WALLET:
      return {
        ...state,
        isConnected: true,
        walletAddress: action.payload.walletAddress,
      };
    case ConfigActions.DISCONNECT_WALLET:
      return {
        ...state,
        isConnected: false,
        walletAddress: "",
      };
    case ConfigActions.SELECT_WALLET:
      return {
        ...state,
        isConnected: false,
        walletAddress: "",
        walletSelected: action.payload.walletSelected,
      };
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
