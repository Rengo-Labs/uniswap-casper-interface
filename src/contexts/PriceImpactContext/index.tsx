export const calculateMinimumTokenReceived = (tokensToTransfer, slippage) => {
  return (tokensToTransfer - tokensToTransfer * slippage / 100).toFixed(8)
}

export const calculateLPPercentage = (value, liquidity) => value / liquidity