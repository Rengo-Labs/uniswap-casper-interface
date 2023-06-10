import BigNumber from 'bignumber.js'

import {
  CLByteArray, CLKey, CLOption,
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
  LIQUIDITY_GAUGE_V3_CONTRACT_HASH,
} from "../../constant"
import {Some} from "ts-results";

/**
 * All allowance smart contract endpoints
 */
export enum GaugeV3EntryPoint {
  CLAIM_REWARDS = "claim_rewards",
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw"
}

/**
 * Sign and deploy deposit
 *
 * @param casperClient Casper Client
 * @param wallet current Casper Wallet
 * 
 * @returns an array containing the deploy hash and deploy result 
 */
export const signAndDeployClaim = async (
  casperClient: CasperClient,
  wallet: Wallet,
): Promise<[string, GetDeployResult]> => {
  try {

    return await casperClient.signAndDeployContractCall(
      wallet,
      "1bc1cdbecf212fa2a59baf272917f44c9a58124c501e5c454c8a32a88418fce3",
      GaugeV3EntryPoint.CLAIM_REWARDS,
      RuntimeArgs.fromMap({
        addr: createRecipientAddress(wallet.publicKey)
      }),
      new BigNumber(5000000000),
    )    
  } catch (err) {
      log.error(`signAndDeployClaim error: ${err}`)
      throw err
  }
}

/**
 * Sign and deploy claim
 *
 * @param casperClient Casper Client
 * @param wallet current Casper Wallet
 *
 * @returns an array containing the deploy hash and deploy result
 */
export const signAndDeployDeposit = async (
  casperClient: CasperClient,
  wallet: Wallet,
  amount: number | string
): Promise<[string, GetDeployResult]> => {
  try {

    return await casperClient.signAndDeployContractCall(
      wallet,
      "1bc1cdbecf212fa2a59baf272917f44c9a58124c501e5c454c8a32a88418fce3",
      GaugeV3EntryPoint.DEPOSIT,
      RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(new BigNumber(amount).toFixed(0, BigNumber.ROUND_DOWN)),
        addr: createRecipientAddress(wallet.publicKey),
        claim_rewards: new CLOption(Some(CLValueBuilder.bool(false)) as any)
      }),
      new BigNumber(100000000000),
    )
  } catch (err) {
    log.error(`signAndDeployDeposit error: ${err}`)
    throw err
  }
}

/**
 * Sign and deploy withdraw
 *
 * @param casperClient Casper Client
 * @param wallet current Casper Wallet
 *
 * @returns an array containing the deploy hash and deploy result
 */
export const signAndDeployWithdraw = async (
  casperClient: CasperClient,
  wallet: Wallet,
  amount: number | string
): Promise<[string, GetDeployResult]> => {
  try {

    return await casperClient.signAndDeployContractCall(
      wallet,
      "1bc1cdbecf212fa2a59baf272917f44c9a58124c501e5c454c8a32a88418fce3",
      GaugeV3EntryPoint.WITHDRAW,
      RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(new BigNumber(amount).toFixed(0, BigNumber.ROUND_DOWN)),
        claim_rewards: new CLOption(Some(CLValueBuilder.bool(false)) as any)
      }),
      new BigNumber(100000000000),
    )
  } catch (err) {
    log.error(`signAndDeployClaim error: ${err}`)
    throw err
  }
}