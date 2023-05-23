import React, {useContext} from "react"
import {LiquidityProviderContext} from "../../../../contexts/LiquidityContext"

export const TestComponent = () => {
  const { getLiquidityDetails, onRemoveLiquidity, onAddLiquidity } = useContext(LiquidityProviderContext)

  const checkLiquidityDetail = async () => {
    const {
      tokensToTransfer,
      exchangeRateA,
      exchangeRateB,
      firstReserve,
      secondReserve
    } = await getLiquidityDetails(
      {symbol: "TK1", decimals: 9} as any,
      {symbol: "TK2", decimals: 9} as any,
      1,
      2,
      100, 
      {symbol: "TK1", decimals: 9} as any,
      0.005, 
      0.003)
    expect(tokensToTransfer).toBe("200.000000000")
    expect(exchangeRateA).toBe(2)
    expect(exchangeRateB).toBe(0.5)
    expect(firstReserve).toBe("1e-9")
    expect(secondReserve).toBe("2e-9")
  }
  const checkAddLiquidity = async () => {
    const result = await onAddLiquidity(2000.00, 1000.00, 0.5, 0.003)
    expect(result).toBe(true)
  }
  const checkRemoveLiquidity = async () => {
    const result = await onRemoveLiquidity(100, 9, {symbol: "TK1"} as any, {symbol: "TK2"} as any, 100, 200, 0.5, 80, true)

    expect(result).toBe(true)
  }

  return (
    <div>
      <button data-testid="key_remove" onClick={checkRemoveLiquidity}>Remove Liquidity</button>
      <button data-testid="key_add" onClick={checkAddLiquidity}>Add Liquidity</button>
      <button data-testid="key_liquidity_detail" onClick={checkLiquidityDetail}>Liquidity Detail</button>
    </div>
  )
}