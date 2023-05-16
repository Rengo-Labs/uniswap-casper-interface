import React, { useContext } from "react"
import { SwapProviderContext } from "../../../../contexts/SwapContext";
import {PairsContextProvider} from "../../../../contexts/PairsContext";

export const TestComponent = () => {
  const { onConfirmSwapConfig, getSwapDetails } = useContext(SwapProviderContext)
  const { findReservesBySymbols } = useContext(PairsContextProvider)

  const tokenState = {}
  const checkSwapDetail = async () => {
    const {
      reserve0,
      reserve1,
    } = findReservesBySymbols("TK1", "TK2", tokenState)

    const {
      tokensToTransfer,
      exchangeRateA,
      exchangeRateB,
    } = await getSwapDetails(
      { symbol: "TK1" } as any,
      { symbol: "TK2" } as any,
      reserve0,
      reserve1,
      100,
      { symbol: "TK1" } as any,
      0.003
    )

    expect(tokensToTransfer).toBe("400")
    expect(exchangeRateA).toBe("20")
    expect(exchangeRateB).toBe("10")
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
