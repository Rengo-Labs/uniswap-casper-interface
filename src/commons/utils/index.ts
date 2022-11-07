
import BigNumber from 'bignumber.js'
import { Logger } from './log'

export const log = new Logger()

export const ONE_BILLION = 10 ** 9

export const convertBigNumberToUIString = (amount: BigNumber): string => amount.div(ONE_BILLION).toString()
export const convertUIStringToBigNumber = (amount: string): BigNumber => new BigNumber(amount).times(ONE_BILLION)

/**
 * 
 * @param ms 
 * @returns 
 */
export const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))