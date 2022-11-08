import BigNumber from 'bignumber.js'

import {
  AccessRights,
  CLAccountHash,
  CLByteArray,
  CLKey,
  CLList,
  CLPublicKey,
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

export enum EntryPoint {
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
  
  INCREASE_ALLOWANCE = "increase_allowance",
  DECREASE_ALLOWANCE = "decrease_allowance",
}


export const selectEntryPoint = (tokenASymbol: string, tokenBSymbol: string): EntryPoint => {
  if (tokenASymbol === 'WCSPR' && tokenBSymbol !== 'WCSPR') {
    return EntryPoint.SWAP_EXACT_CSPR_FOR_TOKENS
  } else if (tokenASymbol !== 'WCSPR' && tokenBSymbol === 'WCSPR') {
    return EntryPoint.SWAP_TOKENS_FOR_EXACT_CSPR_JS_CLIENT
  } else if (tokenASymbol !== 'WCSPR' && tokenBSymbol !== 'WCSPR') {
    return EntryPoint.SWAP_EXACT_TOKENS_FOR_TOKENS_JS_CLIENT
  }
}

export function createRecipientAddress(recipient: any) {
  if (recipient instanceof CLPublicKey) {
    return new CLKey(new CLAccountHash(recipient.toAccountHash()))
  } else {
    return new CLKey(recipient);
  }
}

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
    console.log('slippage', new BigNumber(amountIn).times(slippage + 1.04).toFixed(0))
    
    const publicKey = wallet.publicKey;
    const entryPoint = selectEntryPoint(tokenASymbol, tokenBSymbol)
    
    const response = await apiClient.getPath(tokenASymbol, tokenBSymbol)
    const path = response.pathwithcontractHash.map((x) => new CLString("hash-".concat(x)))

    log.debug("EntryPoint", entryPoint, tokenASymbol, tokenBSymbol, amountOut)

    switch(entryPoint) {
      case EntryPoint.SWAP_EXACT_TOKENS_FOR_TOKENS_JS_CLIENT:
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
      case EntryPoint.SWAP_TOKENS_FOR_EXACT_CSPR_JS_CLIENT:
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
      case EntryPoint.SWAP_EXACT_CSPR_FOR_TOKENS:
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
            destination_entrypoint: CLValueBuilder.string(EntryPoint.SWAP_EXACT_CSPR_FOR_TOKENS),
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