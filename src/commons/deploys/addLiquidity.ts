import BigNumber from 'bignumber.js'

import { 
  Some,
} from 'ts-results'

import {
  AccessRights,
  CLByteArray,
  CLKey,
  CLOption,
  CLValueBuilder,
  GetDeployResult,
  RuntimeArgs,
} from 'casper-js-sdk';

import {
  APIClient,
  Token,
} from '../api'

import {
  Client as CasperClient, 
  Wallet,
} from '../wallet'

import {
  log,
  createRecipientAddress,
} from '../utils'

import {
  ROUTER_CONTRACT_HASH,
  ROUTER_PACKAGE_HASH,
} from "../../constant";

/**
 * All add liquidity smart contract endpoints
 */
export enum AddLiquidityEntryPoint {  
  ADD_LIQUIDITY_CSPR = "add_liquidity_cspr",
  ADD_LIQUIDITY = "add_liquidity",
}

/**
 * Determine which add liquidity endpoint should be used
 * 
 * @param tokenASymbol tokenA symbol
 * @param tokenBSymbol tokenB symbol
 * 
 * @returns which swap endpoint should be used
 */
 export const selectAddLiquidityEntryPoint = (tokenASymbol: string, tokenBSymbol: string): AddLiquidityEntryPoint => {
  if (tokenASymbol === 'CSPR' || tokenBSymbol === 'CSPR') {
    return AddLiquidityEntryPoint.ADD_LIQUIDITY_CSPR
  } else if (tokenASymbol !== 'CSPR' && tokenBSymbol !== 'CSPR') {
    return AddLiquidityEntryPoint.ADD_LIQUIDITY
  }
}

/**
 * Sign and deploy add liquidity 
 * 
 * @param casperClient Casper Client
 * @param wallet current Casper Wallet 
 * @param deadline length of time before giving up
 * @param amountADesired desired amount tokenA
 * @param amountBDesired desired amount tokenB
 * @param tokenA tokenA
 * @param tokenB tokenB
 * @param slippage amount of slippage to abort if exceeded
 * @param mainPurse uref of main purse to send/receive funds
 * 
 * @returns an array containing the deploy hash and deploy result 
 */
 export const signAndDeployAddLiquidity = async (
  apiClient: APIClient,
  casperClient: CasperClient,
  wallet: Wallet,
  deadline: BigNumber.Value,
  amountADesired: BigNumber.Value,
  amountBDesired: BigNumber.Value,
  tokenA: Token,
  tokenB: Token,
  slippage: number,
  mainPurse: string,
  gasFee: number,
  pairHash: string
): Promise<[string, GetDeployResult]> => {
  try {
    const publicKey = wallet.publicKey;
    const entryPoint = selectAddLiquidityEntryPoint(tokenA.symbol, tokenB.symbol)

    const packageHash = new CLByteArray(
      Uint8Array.from(Buffer.from(pairHash.slice(5), "hex"))
    )

    switch (entryPoint) {
      case AddLiquidityEntryPoint.ADD_LIQUIDITY_CSPR:
        // When adding cspr and token
        const token = tokenA.symbol === 'CSPR' ? new CLByteArray(
            Uint8Array.from(Buffer.from(tokenB.packageHash.slice(5), "hex"))
          ) : new CLByteArray(
            Uint8Array.from(Buffer.from(tokenA.packageHash.slice(5), "hex"))
          )

        const amountCSPRDesired = tokenA.symbol === 'CSPR' ? amountADesired : amountBDesired
        const amountTokenDesired = tokenA.symbol !== 'CSPR' ? amountADesired : amountBDesired
        
        return await casperClient.signAndDeployWasm(
          wallet,
          await apiClient.getDeployWasmData(),
          RuntimeArgs.fromMap({
            token: new CLKey(token),
            amount_cspr_desired: CLValueBuilder.u256(new BigNumber(amountCSPRDesired).toFixed(0, BigNumber.ROUND_UP)),
            amount_token_desired: CLValueBuilder.u256(new BigNumber(amountTokenDesired).toFixed(0, BigNumber.ROUND_UP)),
            amount_cspr_min: CLValueBuilder.u256(new BigNumber(amountCSPRDesired).times(1 - slippage).toFixed(0, BigNumber.ROUND_DOWN)),
            amount_token_min: CLValueBuilder.u256(new BigNumber(amountTokenDesired).times(1 - slippage).toFixed(0, BigNumber.ROUND_DOWN)),
            pair: new CLOption(Some(new CLKey(packageHash) as any) as any),
            to: createRecipientAddress(publicKey),
            deadline: CLValueBuilder.u256(new BigNumber(deadline).toFixed(0)),

            // Deploy wasm params
            amount: CLValueBuilder.u512(new BigNumber(amountCSPRDesired).toFixed(0)),
            entrypoint: CLValueBuilder.string(entryPoint),
            package_hash: new CLKey(
              new CLByteArray(
                Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
              )
            ),
          }),
          new BigNumber(gasFee * 10**9),
        )
      case AddLiquidityEntryPoint.ADD_LIQUIDITY:
        // When adding token and token
        const tokenAContract = new CLByteArray(
          Uint8Array.from(Buffer.from(tokenA.packageHash.slice(5), "hex"))
        )    
        
        const tokenBContract = new CLByteArray(
          Uint8Array.from(Buffer.from(tokenB.packageHash.slice(5), "hex"))
        )
        
        return await casperClient.signAndDeployWasm(
          wallet,
          await apiClient.getDeployWasmData(),
          RuntimeArgs.fromMap({
            token_a: new CLKey(tokenAContract),
            token_b: new CLKey(tokenBContract),
            amount_a_desired: CLValueBuilder.u256(new BigNumber(amountADesired).toFixed(0, BigNumber.ROUND_CEIL)),
            amount_b_desired: CLValueBuilder.u256(new BigNumber(amountBDesired).toFixed(0, BigNumber.ROUND_CEIL)),
            amount_a_min: CLValueBuilder.u256(new BigNumber(amountADesired).times(1 - slippage).toFixed(0, BigNumber.ROUND_FLOOR)),
            amount_b_min: CLValueBuilder.u256(new BigNumber(amountBDesired).times(1 - slippage).toFixed(0, BigNumber.ROUND_FLOOR)),
            pair: new CLOption(Some(new CLKey(packageHash) as any) as any),
            to: createRecipientAddress(publicKey),
            deadline: CLValueBuilder.u256(new BigNumber(deadline).toFixed(0)),
            
            // Deploy wasm params
            entrypoint: CLValueBuilder.string(entryPoint),
            package_hash: new CLKey(
              new CLByteArray(
                Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
              )
            ),
          }),
          new BigNumber(gasFee * 10**9),
        )
      default: 
        throw new Error(`this shouldn't happen`)
    }    
  } catch (err) {
      log.error(`signAndDeploySwap error: ${err}`)
      throw err
  }
}