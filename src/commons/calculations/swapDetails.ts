import BigNumber from 'bignumber.js'

import { APIClient, Token } from '../api'
import { log, fixAmountOfZeros } from '../utils'
import {PLATFORM_GAS_FEE} from "../../constant";

/**
 * Swap details
 */
export interface SwapDetails {
  // how many tokens to transfer
  tokensToTransfer: string,
  // estimated price impact
  priceImpact: number | string,
  // effective exchange rate from A to B
  exchangeRateA: number | string,
  // effective exchange rate from B to A
  exchangeRateB: number | string,
}

/**
 * Calculate all the swap details for display
 *
 * @param apiClient API client
 * @param tokenA first token
 * @param tokenB second token
 * @param reserve0 first token reserve in pair
 * @param reserve1 second token reserve in pair
 * @param inputValue input tokens
 * @param token input token types matching one of tokenA or tokenB
 * @param fee decimal fee
 *
 * @return SwapDetails
 */
export const calculateSwapDetails = async (
    apiClient: APIClient,
    tokenA: Token,
    tokenB: Token,
    reserve0: BigNumber.Value,
    reserve1: BigNumber.Value,
    inputValueRaw: BigNumber.Value,
    token: Token,
    slippage = 0.005,
    fee = PLATFORM_GAS_FEE
): Promise<SwapDetails> => {
  try {     
      const isA2B = token.symbol == tokenA.symbol

      const liquidityA = new BigNumber(reserve0)
      const liquidityB = new BigNumber(reserve1)
      const inputValue = new BigNumber(inputValueRaw).times(10 ** 9)
      const inputValueMinusFee = new BigNumber(inputValue).times(1 - fee)
      console.log(inputValueRaw.toString(), inputValue.toString(), reserve0.toString(), reserve1.toString())

      const inputLiquidity = isA2B ? liquidityA : liquidityB
      const outputLiquidity = isA2B ? liquidityB : liquidityA

      const constantProduct = liquidityA.times(liquidityB)
      // console.log("liquidityA", liquidityA.toNumber(), "liquidityB", liquidityB.toNumber(), "constant_product", constantProduct.toNumber(), "tokenToTrade", inputValueMinusFee.toNumber())

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

      // console.log("new_liquidity_a_pool", newLiquidityAPool.toNumber(), "new_liquidity_b_pool", newLiquidityBPool.toNumber())

      const tokensToTransfer = (outputLiquidity.minus(newLiquidityOutputPool))
      // console.log("tokensToTransfer", tokensToTransfer)

      let inputExchangeRate = tokensToTransfer.div(inputValue)
      let outputExchangeRate = new BigNumber(1).div(inputExchangeRate)

      // ignore the post-transfer rate
      if (inputExchangeRate.isNaN() || outputExchangeRate.isNaN()) {
        inputExchangeRate = outputLiquidity.div(inputLiquidity)
        outputExchangeRate = new BigNumber(1).div(inputExchangeRate)
      }

      const exchangeRateA = isA2B ? inputExchangeRate : outputExchangeRate
      const exchangeRateB = isA2B ? outputExchangeRate : inputExchangeRate

      // console.log("exchangeRateA", exchangeRateA, "exchangeRateB", exchangeRateB)

      const priceImpact = inputValueMinusFee.div(inputLiquidity.plus(inputValueMinusFee)).times(100).toNumber()
      // console.log("priceImpact", priceImpact)

      console.log(inputValue.toString(), inputExchangeRate.toString())
      return {
          tokensToTransfer: fixAmountOfZeros(inputValue.times(inputExchangeRate), tokenB.decimals),
          //tokensToTransfer: tokensToTransfer.div(10 ** 9).toNumber().toFixed(9),
          priceImpact: priceImpact >= 0.01 ? priceImpact.toFixed(2) : '<0.01',
          exchangeRateA: exchangeRateA.toNumber().toFixed(9),
          exchangeRateB : exchangeRateB.toNumber().toFixed(9)
      }
  } catch (err) {
      log.error(`getSwapDetail error: ${err}`)
      throw err
  }
}
