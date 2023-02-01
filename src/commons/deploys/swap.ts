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
 * All swap smart contract endpoints
 */
export enum SwapEntryPoint {
  SWAP_EXACT_CSPR_FOR_TOKENS = "swap_exact_cspr_for_tokens",
  SWAP_EXACT_TOKENS_FOR_TOKENS = "swap_exact_tokens_for_tokens",
  SWAP_TOKENS_FOR_EXACT_CSPR = "swap_tokens_for_exact_cspr",
  SWAP_EXACT_TOKENS_FOR_CSPR = "swap_exact_tokens_for_cspr",

  /*SWAP_EXACT_TOKENS_FOR_CSPR_JS_CLIENT = "swap_exact_tokens_for_cspr_js_client",
  SWAP_EXACT_TOKENS_FOR_TOKENS_JS_CLIENT = "swap_exact_tokens_for_tokens_js_client",
  SWAP_CSPR_FOR_EXACT_TOKENS_JS_CLIENT = "swap_cspr_for_exact_tokens_js_client",
  SWAP_TOKENS_FOR_EXACT_CSPR_JS_CLIENT = "swap_tokens_for_exact_cspr_js_client",
  SWAP_TOKENS_FOR_EXACT_TOKENS_JS_CLIENT = "swap_tokens_for_exact_tokens_js_client",*/
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
  if (tokenASymbol === 'CSPR' && tokenBSymbol !== 'CSPR') {
    return SwapEntryPoint.SWAP_EXACT_CSPR_FOR_TOKENS
  } else if (tokenASymbol !== 'CSPR' && tokenBSymbol === 'CSPR') {
    return SwapEntryPoint.SWAP_EXACT_TOKENS_FOR_CSPR
  } else if (tokenASymbol !== 'CSPR' && tokenBSymbol !== 'CSPR') {
    return SwapEntryPoint.SWAP_EXACT_TOKENS_FOR_TOKENS
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
  tokenA: Token,
  tokenB: Token,
  slippage: number,
  mainPurse: string,
  gasFee: number,
): Promise<[string, GetDeployResult]> => {
  try {
    const publicKey = wallet.publicKey;
    const entryPoint = selectSwapEntryPoint(tokenA.symbol, tokenB.symbol)

    const response = await apiClient.getPath(tokenA.symbolPair, tokenB.symbolPair)
    const path = response.pathwithcontractHash.map((x) => new CLString(x))

    log.debug("EntryPoint", entryPoint, tokenA.symbol, tokenB.symbol, amountIn, amountOut)

    switch (entryPoint) {
      case SwapEntryPoint.SWAP_EXACT_TOKENS_FOR_TOKENS:
        // When swapping token to token
        return await casperClient.signAndDeployWasm(
          wallet,
          await apiClient.getDeployWasmData(),
          RuntimeArgs.fromMap({
            amount_in: CLValueBuilder.u256(new BigNumber(amountIn).toFixed(0, BigNumber.ROUND_UP)),
            amount_out_min: CLValueBuilder.u256(new BigNumber(amountOut).times(1 - slippage).toFixed(0, BigNumber.ROUND_DOWN)),
            path: new CLList(path),
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
          new BigNumber(gasFee * 10 ** 9).times(1.1),
        )
      case SwapEntryPoint.SWAP_TOKENS_FOR_EXACT_CSPR:
        // When swapping token for exact casper
        return await casperClient.signAndDeployWasm(
          wallet,
          await apiClient.getDeployWasmData(),
          RuntimeArgs.fromMap({
            amount_out: CLValueBuilder.u256(new BigNumber(amountOut).toFixed(0, BigNumber.ROUND_DOWN)),
            amount_in_max: CLValueBuilder.u256(new BigNumber(amountIn).times(1 + slippage).toFixed(0, BigNumber.ROUND_UP)),
            path: new CLList(path),
            to: CLValueBuilder.uref(
              Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
              AccessRights.READ_ADD_WRITE
            ),
            deadline: CLValueBuilder.u256(new BigNumber(deadline).toFixed(0)),

            // Deploy wasm params
            entrypoint: CLValueBuilder.string(entryPoint),
            package_hash: new CLKey(
              new CLByteArray(
                Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
              )
            ),
          }),
          new BigNumber(gasFee * 10 ** 9),
        )
      case SwapEntryPoint.SWAP_EXACT_TOKENS_FOR_CSPR:
        // When swapping token for exact casper
        return await casperClient.signAndDeployWasm(
          wallet,
          await apiClient.getDeployWasmData(),
          RuntimeArgs.fromMap({
            amount_in: CLValueBuilder.u256(new BigNumber(amountIn).times(1 - slippage).toFixed(0, BigNumber.ROUND_UP)),
            amount_out_min: CLValueBuilder.u256(new BigNumber(amountIn).toFixed(0, BigNumber.ROUND_DOWN)),
            path: new CLList(path),
            to: CLValueBuilder.uref(
              Uint8Array.from(Buffer.from(mainPurse.slice(5, 69), "hex")),
              AccessRights.READ_ADD_WRITE
            ),
            deadline: CLValueBuilder.u256(new BigNumber(deadline).toFixed(0)),

            // Deploy wasm params
            entrypoint: CLValueBuilder.string(entryPoint),
            package_hash: new CLKey(
              new CLByteArray(
                Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
              )
            ),
          }),
          new BigNumber(gasFee * 10 ** 9),
        )
      case SwapEntryPoint.SWAP_EXACT_CSPR_FOR_TOKENS:
        // When swapping casper for tokens
        return await casperClient.signAndDeployWasm(
          wallet,
          await apiClient.getDeployWasmData(),
          RuntimeArgs.fromMap({
            amount_in: CLValueBuilder.u256(new BigNumber(amountIn).toFixed(0, BigNumber.ROUND_UP)),
            amount_out_min: CLValueBuilder.u256(new BigNumber(amountOut).times(1 - slippage).toFixed(0, BigNumber.ROUND_DOWN)),
            path: new CLList(path),
            to: createRecipientAddress(publicKey),
            deadline: CLValueBuilder.u256(new BigNumber(deadline).toFixed(0)),

            // Deploy wasm params
            amount: CLValueBuilder.u512(new BigNumber(amountIn).toFixed(0)),
            entrypoint: CLValueBuilder.string(entryPoint),
            package_hash: new CLKey(
              new CLByteArray(
                Uint8Array.from(Buffer.from(ROUTER_PACKAGE_HASH, "hex"))
              )
            ),
          }),
          new BigNumber(gasFee * 10 ** 9),
        )
      default:
        throw new Error(`this shouldn't happen`)
    }
  } catch (err) {
    log.error(`signAndDeploySwap error: ${err}`)
    throw err
  }
}