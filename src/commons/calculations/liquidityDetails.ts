import BigNumber from 'bignumber.js'

import { APIClient, Token } from '../api'
import { log } from '../utils'

/**
 * Swap details
 */
export interface LiquidityDetails {
  // how many tokens to transfer
  tokensToTransfer: string,
  // effective exchange rate from A to B
  exchangeRateA: number,
  // effective exchange rate from B to A
  exchangeRateB: number,
  firstReserve: any,
  secondReserve: any
}

/**
 * Calculate all the liquidity details for display
 *
 * @param apiClient API client
 * @param tokenA first token
 * @param tokenB second token
 * @param inputValue input tokens
 * @param token input token types matching one of tokenA or tokenB
 * @param slippage decimal slippage
 * @param fee decimal fee
 * 
 * @return LiquidityDetails
 */
export const calculateLiquidityDetails = async (
  apiClient: APIClient, 
  tokenA: Token, 
  tokenB: Token, 
  reserve0: BigNumber.Value,
  reserve1: BigNumber.Value,
  inputValueRaw: BigNumber.Value, 
  token: Token, 
  slippage = 0.005, 
  fee = 0.003
): Promise<LiquidityDetails> => {
  try {
      const isA2B = token.symbol == tokenA.symbol

      const liquidityA = new BigNumber(reserve0)
      const liquidityB = new BigNumber(reserve1)
      const inputValue = new BigNumber(inputValueRaw).times(Math.pow(10,token.decimals))

      const inputLiquidity = isA2B ? liquidityA : liquidityB
      const outputLiquidity = isA2B ? liquidityB : liquidityA

      const inputExchangeRate = outputLiquidity.div(inputLiquidity)
      const outputExchangeRate = new BigNumber(1).div(inputExchangeRate)

      const exchangeRateA = isA2B ? inputExchangeRate : outputExchangeRate
      const exchangeRateB = isA2B ? outputExchangeRate : inputExchangeRate
      // console.log("exchangeRateA", exchangeRateA.toNumber(), "exchangeRateB", exchangeRateB.toNumber())

      const ttt = inputValue.times(inputExchangeRate).div(Math.pow(10, (isA2B ? tokenA.decimals : tokenB.decimals)))
      return {
          tokensToTransfer: ttt.eq(0) ? '0' : ttt.toFixed(isA2B ? tokenB.decimals : tokenA.decimals, BigNumber.ROUND_CEIL),
          exchangeRateA: exchangeRateA.toNumber(),
          exchangeRateB : exchangeRateB.toNumber(),
          firstReserve: inputLiquidity.div(Math.pow(10, tokenA.decimals)).toString(),
          secondReserve: outputLiquidity.div(Math.pow(10, tokenA.decimals)).toString(),
      }
  } catch (err) {
      log.error(`getSwapDetail error: ${err}`)
      throw err
  }
}