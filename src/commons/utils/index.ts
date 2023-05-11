
import BigNumber from 'bignumber.js'
import { Logger } from './log'

export const log = new Logger()

export const ONE_BILLION_E = 9

export const convertBigNumberToUIString = (amount: BigNumber, decimals = 9): string => amount.div(10 ** decimals).toString()
export const convertUIStringToBigNumber = (amount: BigNumber.Value, decimals = 9): BigNumber => new BigNumber(amount).times(10 ** decimals)
export const convertAllFormatsToUIFixedString = (amount: BigNumber.Value, fixed = 6): string => new BigNumber(amount).toFixed(fixed)

export const fixAmountOfZeros = (number: BigNumber, decimals: number) => {
  let divisor = ONE_BILLION_E
  if (ONE_BILLION_E > decimals) {
    divisor = ONE_BILLION_E + Math.abs(decimals - ONE_BILLION_E)
  } else {
    divisor = ONE_BILLION_E - Math.abs(decimals - ONE_BILLION_E)
  }
  const result = number.div(10 ** divisor)
  return result.toFixed(ONE_BILLION_E);
}

/**
 *
 * @param ms
 * @returns
 */
export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const formatNaN = (value: string | number) => {
  const parsedValue =  (typeof value === 'string') ? parseFloat(value) : value
  return isNaN(parsedValue) ? 0 : parsedValue;
}

export { createRecipientAddress } from './keys'
