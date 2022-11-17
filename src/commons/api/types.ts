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
  allowance?: string
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

/**
 * Allowance Against Owner And Spender response
 */
export interface AllowanceAgainstOwnerAndSpenderResponse {
  allowance: string,
  message: string,
  success: boolean,
}

/**
 * Allowance Against Owner And Spender Pair Contract response
 */
export interface AllowanceAgainstOwnerAndSpenderPairContractResponse {
  allowance: string,
  message: string,
  success: boolean,
}

/**
 * Liquidity Against User And Pair response
 */
 export interface LiquidityAgainstUserAndPairResponse {
  liquidity: string,
  message: string,
  success: boolean,
}


/**
 * Balance Against User response
 */
export interface BalanceAgainstUserResponse {
  balance: string,
  message: string,
  success: boolean,
}

/**
 * Pair Token
 */
export interface PairToken {
  derivedETH: string,
  id: string,
  name: string,
  symbol: string,
  totalLiquidity: string,
}

/**
 * Pair
 */
export interface Pair {
  createdAtBlockNumber: string,
  createdAtTimestamp: number,
  id: string,
  liquidityProviderCount: string,
  reserve0: string,
  reserve1: string,
  totalReserve0: string,
  totalReserve1: string,
  reserveETH: string,
  reserveUSD: string,
  token0: PairToken,
  token1: PairToken,
  token0Price: string,
  token1Price: string,
  totalSupply: string,
  trackedReserveETH: string,
  txCount: string,
  untrackedVolumeUSD: string,
  volumeToken0: string,
  volumeToken1: string,
  volumeUSD: string,
}

/**
 * Pair List response
 */
export interface PairListResponse {
  pairList: Pair[],
  message: string,
  success: boolean,
}

/**
 * User Pairs
 */
export interface UserPair {
  id: string,
  pair: string,
  reserve0: string,
  reserve1: string,
}

/**
 * Pair Against User response
 */
export interface PairAgainstUserResponse {
  pairsdata: Pair[],
  userpairs: UserPair[],
  message: string,
  success: boolean,
}