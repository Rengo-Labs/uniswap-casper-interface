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
  inputValueRaw: BigNumber.Value, 
  token: Token, 
  slippage = 0.005, 
  fee = 0.003
): Promise<LiquidityDetails> => {
  try {
      const data = await apiClient.getPathReserves(tokenA.symbol, tokenB.symbol)
      
      const isA2B = token.symbol == tokenA.symbol

      const liquidityA = new BigNumber(data.reserve0)
      const liquidityB = new BigNumber(data.reserve1)
      const inputValue = new BigNumber(inputValueRaw).times(Math.pow(10,9))
      
      const inputLiquidity = isA2B ? liquidityA : liquidityB
      const outputLiquidity = isA2B ? liquidityB : liquidityA

      const inputExchangeRate = outputLiquidity.div(inputLiquidity)
      const outputExchangeRate = new BigNumber(1).div(inputExchangeRate)

      const exchangeRateA = isA2B ? inputExchangeRate : outputExchangeRate
      const exchangeRateB = isA2B ? outputExchangeRate : inputExchangeRate
      console.log("exchangeRateA", exchangeRateA, "exchangeRateB", exchangeRateB)

      return {
          tokensToTransfer: inputValue.times(inputExchangeRate).div(Math.pow(10,9)).toNumber().toFixed(9),
          exchangeRateA: exchangeRateA.toNumber(),
          exchangeRateB : exchangeRateB.toNumber(),
          firstReserve: normalizeAmount(inputLiquidity.toString(), 9),
          secondReserve: normalizeAmount(outputLiquidity.toString(), 9)
      }
  } catch (err) {
      log.error(`getSwapDetail error: ${err}`)
      throw err
  }
}

const normalizeAmount = (amount, decimalQuantity) => {
    const strAmount = parseFloat(amount).toFixed(0).toString();

    if (strAmount.length > decimalQuantity) {
        const newReserve = strAmount.slice(0, strAmount.length - decimalQuantity) + '.' + strAmount.slice(strAmount.length - decimalQuantity, strAmount.length)
        return parseFloat(newReserve)
    } else {
        let newReserve = strAmount

        for (let i = 0; i < decimalQuantity; i++) {
            if (newReserve.length < decimalQuantity) {
                newReserve = '0' + newReserve
            } else {
                break
            }
        }
        return parseFloat(`0.${newReserve}`)
    }
}