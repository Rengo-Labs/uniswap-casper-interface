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
  GAS_PRICE_FOR_APPROVAL,
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
 *
 * @returns which allowance endpoint should be used
 * @param amount
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
 * @param casperClient Casper Client
 * @param wallet current Casper Wallet
 * @param contractHash
 * @param amount
 * @param optApproval
 * @param spender
 *
 * @returns an array containing the deploy hash and deploy result
 */
export const signAndDeployAllowance = async (
  casperClient: CasperClient,
  wallet: Wallet,
  contractHash: string,
  amount: BigNumber.Value,
  optApproval = "",
  spender
): Promise<[string, GetDeployResult]> => {
  try {
    const entryPoint = optApproval === "" ? selectAllowanceEntryPoint(amount) : optApproval
    const spenderByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from( spender != null ? spender.slice(5) : ROUTER_PACKAGE_HASH, "hex"))
    )

    return await casperClient.signAndDeployContractCall(
      wallet,
      contractHash.slice(5),
      entryPoint,
      RuntimeArgs.fromMap({
        spender: createRecipientAddress(spenderByteArray),
        amount: CLValueBuilder.u256(new BigNumber(amount).toFixed(0)),
      }),
      new BigNumber(GAS_PRICE_FOR_APPROVAL).times(10 ** 9),
    )
  } catch (err) {
      log.error(`signAndDeployAllowance error: ${err}`)
      throw err
  }
}
