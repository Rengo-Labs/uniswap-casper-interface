import BigNumber from 'bignumber.js'

import {
  AccessRights,
  CLByteArray,
  CLKey,
  CLList,
  CLString,
  CLValueBuilder,
  GetDeployResult,
  RuntimeArgs,
} from 'casper-js-sdk';

import {
  APIClient,
} from '../api'

import {
  Client as CasperClient, 
  Wallet,
} from '../wallet'

import {
  log,
} from '../utils'

import {
  ROUTER_CONTRACT_HASH,
  ROUTER_PACKAGE_HASH,
} from "../../constant";

import {
  createRecipientAddress
} from './utils'

/**
 * All swap smart contract endpoints
 */
export enum SwapEntryPoint {
  APPROVE = "approve",
  
  ADD_LIQUIDITY_JS_CLIENT = "add_liquidity_js_client",
  REMOVE_LIQUIDITY_JS_CLIENT = "remove_liquidity_js_client",
  
  SWAP_EXACT_CSPR_FOR_TOKENS = "swap_exact_cspr_for_tokens",
  SWAP_TOKENS_FOR_EXACT_CSPR = "swap_tokens_for_exact_cspr",
  SWAP_EXACT_TOKENS_FOR_CSPR = "swap_exact_tokens_for_cspr",
  
  SWAP_EXACT_TOKENS_FOR_CSPR_JS_CLIENT = "swap_exact_tokens_for_cspr_js_client",
  SWAP_EXACT_TOKENS_FOR_TOKENS_JS_CLIENT = "swap_exact_tokens_for_tokens_js_client",
  SWAP_CSPR_FOR_EXACT_TOKENS_JS_CLIENT = "swap_cspr_for_exact_tokens_js_client",
  SWAP_TOKENS_FOR_EXACT_CSPR_JS_CLIENT = "swap_tokens_for_exact_cspr_js_client",
  SWAP_TOKENS_FOR_EXACT_TOKENS_JS_CLIENT = "swap_tokens_for_exact_tokens_js_client",
}

/**
 * Determine which swap endpoint should be used
 * 
 * @param tokenASymbol tokenA symbol
 * @param tokenBSymbol tokenB symbol
 * 
 * @returns which swap endpoint should be used
 */
export const selectSwapEntryPoint = (tokenASymbol: string, tokenBSymbol: string): SwapEntryPoint => {
  if (tokenASymbol === 'WCSPR' && tokenBSymbol !== 'WCSPR') {
    return SwapEntryPoint.SWAP_EXACT_CSPR_FOR_TOKENS
  } else if (tokenASymbol !== 'WCSPR' && tokenBSymbol === 'WCSPR') {
    return SwapEntryPoint.SWAP_TOKENS_FOR_EXACT_CSPR_JS_CLIENT
  } else if (tokenASymbol !== 'WCSPR' && tokenBSymbol !== 'WCSPR') {
    return SwapEntryPoint.SWAP_EXACT_TOKENS_FOR_TOKENS_JS_CLIENT
  }
}

/**
 * Sign and deploy swap 
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
export const signAndDeploySwap = async (
  apiClient: APIClient,
  casperClient: CasperClient,
  wallet: Wallet,
  deadline: BigNumber.Value,
  amountIn: BigNumber.Value,
  amountOut: BigNumber.Value,
  tokenASymbol: string,
  tokenBSymbol: string,
  slippage: number,
  mainPurse: string,
): Promise<[string, GetDeployResult]> => {
  try {
    //console.log('slippage', new BigNumber(amountIn).times(slippage + 1.04).toFixed(0))
    
    const publicKey = wallet.publicKey;
    const entryPoint = selectSwapEntryPoint(tokenASymbol, tokenBSymbol)
    
    const response = await apiClient.getPath(tokenASymbol, tokenBSymbol)
    const path = response.pathwithcontractHash.map((x) => new CLString("hash-".concat(x)))

    log.debug("EntryPoint", entryPoint, tokenASymbol, tokenBSymbol, amountOut)

    switch(entryPoint) {
      case SwapEntryPoint.SWAP_EXACT_TOKENS_FOR_TOKENS_JS_CLIENT:
        // When swapping token to token
        return await casperClient.signAndDeployContractCall(
          wallet,
          ROUTER_CONTRACT_HASH, 
          entryPoint,
          RuntimeArgs.fromMap({
            amount_in: CLValueBuilder.u256(new BigNumber(amountIn).toFixed(0)),
            amount_out_min: CLValueBuilder.u256(new BigNumber(amountOut).times(.96 - slippage).toFixed(0)),
            path: new CLList(path),
            to: createRecipientAddress(publicKey),
            deadline: CLValueBuilder.u256(new BigNumber(deadline).toFixed(0)),
          }),
          new BigNumber(10000000000),
        )
      case SwapEntryPoint.SWAP_TOKENS_FOR_EXACT_CSPR_JS_CLIENT:
        // When swapping token for exact casper
        return await casperClient.signAndDeployContractCall(
          wallet,
          ROUTER_CONTRACT_HASH, 
          entryPoint,
          RuntimeArgs.fromMap({
            amount_in_max: CLValueBuilder.u256(new BigNumber(amountIn).times(1.04 + slippage).toFixed(0)),
            amount_out: CLValueBuilder.u256(new BigNumber(amountOut).toFixed(0)),
            path: new CLList(path),
            to: CLValueBuilder.uref(
              Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
              AccessRights.READ_ADD_WRITE
            ),
            deadline: CLValueBuilder.u256(new BigNumber(deadline).toFixed(0)),
          }),
          new BigNumber(10000000000),
        )
      case SwapEntryPoint.SWAP_EXACT_CSPR_FOR_TOKENS:
        // When swapping casper for tokens
        return await casperClient.signAndDeployWasm(
          wallet,
          await apiClient.getDeployWasmData(),
          RuntimeArgs.fromMap({
            amount_in: CLValueBuilder.u256(new BigNumber(amountIn).toFixed(0)),
            amount_out_min: CLValueBuilder.u256(new BigNumber(amountOut).times(.96 - slippage).toFixed(0)),
            path: new CLList(path),
            to: createRecipientAddress(publicKey),
            deadline: CLValueBuilder.u256(new BigNumber(deadline).toFixed(0)),

            // Deploy wasm params
            amount: CLValueBuilder.u512(new BigNumber(amountIn).toFixed(0)),
            destination_entrypoint: CLValueBuilder.string(SwapEntryPoint.SWAP_EXACT_CSPR_FOR_TOKENS),
            router_hash: new CLKey(
              new CLByteArray(
                Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
              )
            ),
            purse: CLValueBuilder.uref(
              Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
              AccessRights.READ_ADD_WRITE
            ),
          }),
          new BigNumber(10000000000),
        )
      default: 
        throw new Error(`this shouldn't happen`)
    }
  } catch (err) {
      log.error(`signAndDeploySwap error: ${err}`)
      throw err
  }
}