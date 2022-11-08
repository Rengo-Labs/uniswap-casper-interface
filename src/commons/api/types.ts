/**
 * Token List
 */
export interface TokenList {
  keywords: string[],
  logoURI: string,
  name: string,
  timestamp: string,
  tokens: Token[],
  version: {
    major: number,
    minor: number,
    patch: 0,
  }
}

/**
 * Token 
 */
export interface Token {
  amount?: string
  symbolPair?: string
  chainId: number
  contractHash: string
  decimals: number
  logoURI: string
  name: string
  packageHash: string
  symbol: string
}

/**
 * Path Reserve Response
 */
export interface PathReservesResponse {
  message: string
  reserve0: string
  reserve1: string
  success: boolean
}

/**
 * Path Response
 */
export interface PathResponse {
  message: string,
  path: string[],
  pathwithcontractHash: string[],
  success: boolean,
}

/**
 * Deploy Wasm Data response
 */
export interface DeployWasmDataResponse {
  message: string,
  wasmData: any,
  success: boolean,
}