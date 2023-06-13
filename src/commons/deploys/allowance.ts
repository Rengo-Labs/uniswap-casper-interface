import BigNumber from 'bignumber.js'

import {
  CLByteArray,
  CLValueBuilder,
  GetDeployResult,
  RuntimeArgs,
} from 'casper-js-sdk'

import {
  Client as CasperClient, 
  Wallet,
} from '../wallet'

import {
  log,
  createRecipientAddress,
} from '../utils'

import {
  ROUTER_PACKAGE_HASH,
} from "../../constant"

/**
 * All allowance smart contract endpoints
 */
export enum AllowanceEntryPoint {
  INCREASE_ALLOWANCE = "increase_allowance",
  DECREASE_ALLOWANCE = "decrease_allowance",
}

/**
 * Determine which allowance endpoint should be used
 * 
 * @param tokenASymbol tokenA symbol
 * @param tokenBSymbol tokenB symbol
 * 
 * @returns which allowance endpoint should be used
 */
export const selectAllowanceEntryPoint = (amount: BigNumber.Value): AllowanceEntryPoint => {
  if (new BigNumber(amount).gt(0)) {
    return AllowanceEntryPoint.INCREASE_ALLOWANCE
  }
  
  return AllowanceEntryPoint.DECREASE_ALLOWANCE
}

/**
 * Sign and deploy allowance 
 * 
 * @param apiClient APIClient
 * @param casperClient Casper Client
 * @param wallet current Casper Wallet 
 * @param deadline length of time before giving up
 * @param amountIn desired amount in
 * @param amountOut desired amount out
 * @param tokenASymbol tokenA symbol
 * @param tokenBSymbol tokenB symbol
 * @param slippage amount of slippage to abort if exceeded
 * @param mainPurse uref of main purse to send/receive funds
 * 
 * @returns an array containing the deploy hash and deploy result 
 */
export const signAndDeployAllowance = async (
  casperClient: CasperClient,
  wallet: Wallet,
  contractHash: string,
  amount: BigNumber.Value,
  optApproval = "",
  spender = ROUTER_PACKAGE_HASH,
): Promise<[string, GetDeployResult]> => {
  try {
    const entryPoint = optApproval === "" ? selectAllowanceEntryPoint(amount) : optApproval

    const spenderByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
    )

    return await casperClient.signAndDeployContractCall(
      wallet,
      contractHash.slice(5), 
      entryPoint,
      RuntimeArgs.fromMap({
        spender: createRecipientAddress(spenderByteArray),
        amount: CLValueBuilder.u256(new BigNumber(amount).toFixed(0)),
      }),
      new BigNumber(3000000000),
    )    
  } catch (err) {
      log.error(`signAndDeployAllowance error: ${err}`)
      throw err
  }
}