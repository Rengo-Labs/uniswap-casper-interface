export async function onConnect(onConnectWallet) {
  onConnectWallet();
}

export function onSwitchTokensHandler(
  onSwitchTokens,
  lastChanged,
  changeTokenB,
  amountSwapTokenA,
  setLastChanged,
  changeTokenA,
  amountSwapTokenB
) {
  onSwitchTokens();

  if (lastChanged == "A") {
    changeTokenB(amountSwapTokenA.toString());
    setLastChanged("B");
  } else if (lastChanged == "B") {
    changeTokenA(amountSwapTokenB.toString());
    setLastChanged("A");
  }
}

export function resetAll(amountSwapTokenASetter, amountSwapTokenBSetter) {
  amountSwapTokenASetter(0);
  amountSwapTokenBSetter(0);
}

export async function onConfirmSwap(
  setActiveModalSwap,
  onConfirmSwapConfig,
  amountSwapTokenA,
  amountSwapTokenB,
  slippSwapToken,
  gasFee,
  resetAll
) {
  setActiveModalSwap(false);
  const waiting = await onConfirmSwapConfig(
    amountSwapTokenA,
    amountSwapTokenB,
    slippSwapToken,
    gasFee
  );
  resetAll();
}

export async function updateSwapDetail(
  tokenA,
  tokenB,
  amountSwapTokenA,
  firstTokenSelected,
  getSwapDetails,
  slippSwapToken,
  feeToPay,
  tokensToTransferSetter,
  priceImpactSetter,
  exchangeRateASetter,
  exchangeRateBSetter,
  defaultPriceImpactLabelSetter
) {
  const getSwapDetailP = getSwapDetails(
    tokenA,
    tokenB,
    amountSwapTokenA,
    firstTokenSelected,
    slippSwapToken,
    feeToPay
  );
  const ps = [getSwapDetailP];

  const [getSwapDetailResponse] = await Promise.all(ps);

  const { tokensToTransfer, priceImpact, exchangeRateA, exchangeRateB } =
    getSwapDetailResponse;

  tokensToTransferSetter(tokensToTransfer);
  priceImpactSetter(priceImpact);
  exchangeRateASetter(exchangeRateA);
  exchangeRateBSetter(exchangeRateB);

  defaultPriceImpactLabelSetter(
    parseFloat(priceImpact) > 1 ? "Price Impact Warning" : "Low Price Impact"
  );
  return tokensToTransfer;
}
