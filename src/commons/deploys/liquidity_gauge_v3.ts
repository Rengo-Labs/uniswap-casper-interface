import BigNumber from 'bignumber.js'

import {
  CLAccountHash,
  CLByteArray, CLKey, CLOption, CLPublicKey,
  CLValueBuilder, CLValueParsers, Contracts,
  CLKeyType,
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
  GAS_FEE_FOR_GAUGE_CLAIM,
  GAS_FEE_FOR_GAUGE_STAKE,
  GAS_FEE_FOR_GAUGE_UNSTAKE,
  LIQUIDITY_GAUGE_V3_CONTRACT_HASH,
} from "../../constant"
import {Some, None} from "ts-results";

/**
 * All allowance smart contract endpoints
 */
export enum GaugeV3EntryPoint {
  CLAIM_REWARDS = "claim_rewards",
  DEPOSIT = "deposit",
  APPROVE = "approve",
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
  contractHash: string
): Promise<[string, GetDeployResult]> => {
  try {

    return await casperClient.signAndDeployContractCall(
      wallet,
      contractHash,
      GaugeV3EntryPoint.CLAIM_REWARDS,
      RuntimeArgs.fromMap({
        addr:  CLValueBuilder.option(None, new CLKeyType()),
        receiver: CLValueBuilder.option(None, new CLKeyType()),
      }),
      new BigNumber(GAS_FEE_FOR_GAUGE_CLAIM).times(10**9),
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
  contractHash: string,
  amount: BigNumber
): Promise<[string, GetDeployResult]> => {
  try {

    return await casperClient.signAndDeployContractCall(
      wallet,
      contractHash,
      GaugeV3EntryPoint.DEPOSIT,
      RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(amount.toFixed(0, BigNumber.ROUND_DOWN)),
        claim_rewards: CLValueBuilder.option(Some(CLValueBuilder.bool(false)))
      }),
      new BigNumber(GAS_FEE_FOR_GAUGE_STAKE).times(10**9),
    )
  } catch (err) {
    log.error(`signAndDeployDeposit error: ${err}`)
    throw err
  }
}

export const signAndDeployApproveGauge = async (
  casperClient: CasperClient,
  wallet: Wallet,
  contractHash: string,
  amount: BigNumber
): Promise<[string, GetDeployResult]> => {
  try {

    return await casperClient.signAndDeployContractCall(
      wallet,
      contractHash,
      GaugeV3EntryPoint.APPROVE,
      RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(amount.toFixed(0, BigNumber.ROUND_DOWN)),
        addr: CLValueBuilder.option(Some(new CLKey(wallet.publicKey))),
        claim_rewards: CLValueBuilder.option(Some(CLValueBuilder.bool(false)))
      }),
      new BigNumber(GAS_FEE_FOR_GAUGE_STAKE).times(10**9),
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
  contractHash: string,
  amount: BigNumber
): Promise<[string, GetDeployResult]> => {
  try {

    return await casperClient.signAndDeployContractCall(
      wallet,
      LIQUIDITY_GAUGE_V3_CONTRACT_HASH,
      GaugeV3EntryPoint.WITHDRAW,
      RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(amount.toFixed(0, BigNumber.ROUND_DOWN)),
        claim_rewards: CLValueBuilder.option(Some(CLValueBuilder.bool(true)))
      }),
      new BigNumber(GAS_FEE_FOR_GAUGE_UNSTAKE).times(10**9),
    )
  } catch (err) {
    log.error(`signAndDeployClaim error: ${err}`)
    throw err
  }
}

export const getBalanceOf = async (casperClient: any, contractHash: string, contractPackage: string, wallet: Wallet) => {

  const { Contract } = Contracts
  const contractClient = new Contract(casperClient)
  contractClient.setContractHash(contractHash, contractPackage)

  const finalBytes = CLValueParsers.toBytes(wallet.publicKey).unwrap();
  const itemKey = Buffer.from(finalBytes).toString("base64");

  const balance = await contractClient.queryContractDictionary("balances", itemKey)
  //const balance = await contractClient.balanceOf(wallet.publicKey)
  console.log("staking balance", balance)

  return balance
}
