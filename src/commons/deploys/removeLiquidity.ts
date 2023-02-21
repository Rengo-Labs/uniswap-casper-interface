import BigNumber from 'bignumber.js'

import {
  AccessRights,
  CLByteArray,
  CLKey,
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
 * All remove liquidity smart contract endpoints
 */
export enum RemoveLiquidityEntryPoint {  
  REMOVE_LIQUIDITY_CSPR = "remove_liquidity_cspr",
  REMOVE_LIQUIDITY = "remove_liquidity",
}

/**
 * Determine which remove liquidity endpoint should be used
 * 
 * @param tokenASymbol tokenA symbol
 * @param tokenBSymbol tokenB symbol
 * 
 * @returns which swap endpoint should be used
 */
 export const selectRemoveLiquidityEntryPoint = (tokenASymbol: string, tokenBSymbol: string): RemoveLiquidityEntryPoint => {
  if (tokenASymbol === 'CSPR' || tokenBSymbol === 'CSPR') {
    return RemoveLiquidityEntryPoint.REMOVE_LIQUIDITY_CSPR
  } else if (tokenASymbol !== 'CSPR' && tokenBSymbol !== 'CSPR') {
    return RemoveLiquidityEntryPoint.REMOVE_LIQUIDITY
  }
}

/**
 * Sign and deploy remove liquidity 
 * 
 * @param casperClient Casper Client
 * @param wallet current Casper Wallet 
 * @param deadline length of time before giving up
 * @param liquidity amount of liquidity tokens to remove
 * @param amountADesired desired amount tokenA
 * @param amountBDesired desired amount tokenB
 * @param tokenA tokenA
 * @param tokenB tokenB
 * @param slippage amount of slippage to abort if exceeded
 * @param mainPurse uref of main purse to send/receive funds
 * @param gas 
 * 
 * @returns an array containing the deploy hash and deploy result 
 */
 export const signAndDeployRemoveLiquidity = async (
  apiClient: APIClient,
  casperClient: CasperClient,
  wallet: Wallet,
  deadline: BigNumber.Value,
  liquidity: BigNumber.Value,
  amountADesired: BigNumber.Value,
  amountBDesired: BigNumber.Value,
  tokenA: Token,
  tokenB: Token,
  slippage: number,
  mainPurse: string,
  gasFee: number,
): Promise<[string, GetDeployResult]> => {
  try {
    const publicKey = wallet.publicKey;
    const entryPoint = selectRemoveLiquidityEntryPoint(tokenA.symbol, tokenB.symbol)

    switch (entryPoint) {
      case RemoveLiquidityEntryPoint.REMOVE_LIQUIDITY_CSPR:
        console.log('removeLiquidityCSPR', tokenA, tokenB)
        // When adding cspr and token
        const token = (tokenA.symbol === 'CSPR' || tokenA.symbol === 'WCSPR') ? new CLByteArray(
            Uint8Array.from(Buffer.from(tokenB.packageHash.slice(5), "hex"))
          ) : new CLByteArray(
            Uint8Array.from(Buffer.from(tokenA.packageHash.slice(5), "hex"))
          )
        
        const amountCSPRDesired = tokenA.symbol === 'CSPR' ? amountADesired : amountBDesired
        const amountTokenDesired = tokenA.symbol !== 'CSPR' ? amountADesired : amountBDesired

        // console.log('qqq', new CLKey(token), tokenA, tokenB)

        return await casperClient.signAndDeployWasm(
          wallet,
          await apiClient.getDeployWasmData(),
          RemoveLiquidityEntryPoint.REMOVE_LIQUIDITY_CSPR,
          RuntimeArgs.fromMap({
            token: new CLKey(token),
            liquidity: CLValueBuilder.u256(new BigNumber(liquidity).toFixed(0, BigNumber.ROUND_UP)),
            amount_cspr_min: CLValueBuilder.u256(new BigNumber(amountCSPRDesired).times(1 - slippage).toFixed(0, BigNumber.ROUND_DOWN)),
            amount_token_min: CLValueBuilder.u256(new BigNumber(amountTokenDesired).times(1 - slippage).toFixed(0, BigNumber.ROUND_DOWN)),
            to: createRecipientAddress(publicKey),
            deadline: CLValueBuilder.u256(new BigNumber(deadline).toFixed(0)),
            to_purse: CLValueBuilder.uref(
              Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
              AccessRights.READ_ADD_WRITE
            ),

            // Deploy wasm params
            //amount: CLValueBuilder.u256(new BigNumber(amountCSPRDesired).toFixed(0)),
            entrypoint: CLValueBuilder.string(entryPoint),
            package_hash: new CLKey(
              new CLByteArray(
                Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
              )
            ),
          }),
          new BigNumber(gasFee * 10**9),
        )
      case RemoveLiquidityEntryPoint.REMOVE_LIQUIDITY:
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
          RemoveLiquidityEntryPoint.REMOVE_LIQUIDITY,
          RuntimeArgs.fromMap({
            token_a: new CLKey(tokenAContract),
            token_b: new CLKey(tokenBContract),
            liquidity: CLValueBuilder.u256(new BigNumber(liquidity).toFixed(0, BigNumber.ROUND_UP)),
            amount_a_min: CLValueBuilder.u256(new BigNumber(amountADesired).times(1 - slippage).toFixed(0, BigNumber.ROUND_DOWN)),
            amount_b_min: CLValueBuilder.u256(new BigNumber(amountBDesired).times(1 - slippage).toFixed(0, BigNumber.ROUND_DOWN)),
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