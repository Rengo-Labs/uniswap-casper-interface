import React, {useContext} from "react"
import {SwapProviderContext} from "../../../../contexts/SwapContext";

export const TestComponent = () => {
  const { onConfirmSwapConfig, getSwapDetails } = useContext(SwapProviderContext)

  const checkSwapDetail = async () => {
    const {
      tokensToTransfer,
      exchangeRateA,
      exchangeRateB,
    } = await getSwapDetails({symbol: "TK1"} as any, {symbol: "TK2"} as any, 100, {symbol: "TK1"} as any, 0.005, 0.003)


    expect(tokensToTransfer).toBe("400")
    expect(exchangeRateA).toBe(20)
    expect(exchangeRateB).toBe(10)
  }
  const checkSwapper = async () => {
    const result = await onConfirmSwapConfig(2000.00, 1000.00, 0.5, 0.003)
    expect(result).toBe(true)
  }

  return (
    <div>
      <button data-testid="key_swap" onClick={checkSwapper}>Swap</button>
      <button data-testid="key_swap_detail" onClick={checkSwapDetail}>Swap Detail</button>
    </div>
  )
}