export const initialConfigState = {
  isConnected: false,
  walletAddress: "",
  walletSelected: "casper",
  languagesSelected: "en",
  visualModeSelected: "light",
  slippageToleranceSelected: "0.5",
  gasPriceSelected: "10",
};
export function ConfigReducer(state, action) {
  switch (action.type) {
    case "value":
      break;

    default:
      break;
  }
}
