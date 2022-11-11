import BigNumber from 'bignumber.js'

import { APIClient, Token } from '../api'
import { log } from '../utils'

/**
 * Swap details
 */
export interface SwapDetails {
  // how many tokens to transfer
  tokensToTransfer: string,
  // estimated price impact
  priceImpact: string,
  // effective exchange rate from A to B
  exchangeRateA: number,
  // effective exchange rate from B to A
  exchangeRateB: number,
}

/**
 * Calculate all the swap details for display
 *
 * @param apiClient API client
 * @param tokenA first token
 * @param tokenB second token
 * @param inputValue input tokens
 * @param token input token types matching one of tokenA or tokenB
 * @param slippage decimal slippage
 * @param fee decimal fee
 * 
 * @return SwapDetails
 */
export const calculateSwapDetails = async (
    apiClient: APIClient, 
    tokenA: Token, 
    tokenB: Token, 
    inputValueRaw: BigNumber.Value, 
    token: Token, 
    slippage = 0.005, 
    fee = 0.003
): Promise<SwapDetails> => {
  try {
      const data = await apiClient.getPathReserves(tokenA.symbol, tokenB.symbol)
      
      const isA2B = token.symbol == tokenA.symbol

      const liquidityA = new BigNumber(data.reserve0)
      const liquidityB = new BigNumber(data.reserve1)
      const inputValue = new BigNumber(inputValueRaw).times(10 ** 9)
      const inputValueMinusFee = new BigNumber(inputValue).times(1 - fee)

      const inputLiquidity = isA2B ? liquidityA : liquidityB
      const outputLiquidity = isA2B ? liquidityB : liquidityA

      const constantProduct = liquidityA.times(liquidityB)
      console.log("liquidityA", liquidityA.toNumber(), "liquidityB", liquidityB.toNumber(), "constant_product", constantProduct.toNumber(), "tokenToTrade", inputValueMinusFee.toNumber())

      let newLiquidityAPool = liquidityA
      let newLiquidityBPool = liquidityB

      if (isA2B) {
          newLiquidityAPool = liquidityA.plus(inputValueMinusFee)
          newLiquidityBPool = constantProduct.div(newLiquidityAPool)
      } else {
          newLiquidityBPool = liquidityB.plus(inputValueMinusFee)
          newLiquidityAPool = constantProduct.div(newLiquidityBPool)
      }

      const newLiquidityInputPool = isA2B ? newLiquidityAPool : newLiquidityBPool
      const newLiquidityOutputPool = isA2B ? newLiquidityBPool : newLiquidityAPool

      console.log("new_liquidity_a_pool", newLiquidityAPool.toNumber(), "new_liquidity_b_pool", newLiquidityBPool.toNumber())

      const tokensToTransfer = (outputLiquidity.minus(newLiquidityOutputPool))
      console.log("tokensToTransfer", tokensToTransfer)

      let inputExchangeRate = tokensToTransfer.div(inputValue)
      let outputExchangeRate = new BigNumber(1).div(inputExchangeRate)

      if (inputExchangeRate.isNaN() || outputExchangeRate.isNaN()) {
        inputExchangeRate = outputLiquidity.div(inputLiquidity)
        outputExchangeRate = new BigNumber(1).div(inputExchangeRate)
      }
      
      console.log('exchange rates', inputExchangeRate.toString(), outputExchangeRate.toString())

      const exchangeRateA = isA2B ? inputExchangeRate : outputExchangeRate
      const exchangeRateB = isA2B ? outputExchangeRate : inputExchangeRate

      console.log("exchangeRateA", exchangeRateA, "exchangeRateB", exchangeRateB)

      const priceImpact = inputValueMinusFee.div(inputLiquidity.plus(inputValueMinusFee)).times(100).toNumber()
      console.log("priceImpact", priceImpact)

      return {
          tokensToTransfer: tokensToTransfer.div(10 ** 9).toNumber().toFixed(9),
          priceImpact: priceImpact >= 0.01 ? priceImpact.toFixed(2) : '<0.01',
          exchangeRateA: exchangeRateA.toNumber(),
          exchangeRateB : exchangeRateB.toNumber()
      }
  } catch (err) {
      log.error(`getSwapDetail error: ${err}`)
      throw err
  }
}