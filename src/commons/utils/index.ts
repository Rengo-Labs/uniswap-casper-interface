
import BigNumber from 'bignumber.js'
import { Logger } from './log'

export const log = new Logger()

export const ONE_BILLION_E = 9

export const convertBigNumberToUIString = (amount: BigNumber, decimals = 9): string => amount.div(10 ** ONE_BILLION_E).toString()
export const convertUIStringToBigNumber = (amount: BigNumber.Value, decimals = 9): BigNumber => new BigNumber(amount).times(10 ** ONE_BILLION_E)

/**
 * 
 * @param ms 
 * @returns 
 */
export const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))