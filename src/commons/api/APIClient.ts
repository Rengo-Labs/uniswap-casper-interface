import axios from 'axios'

import { 
  AllowanceAgainstOwnerAndSpenderResponse,
  DeployWasmDataResponse,
  TokenList,
  PathResponse,
  PathReservesResponse,
  LiquidityAgainstUserAndPairResponse,
  BalanceAgainstUserResponse,
  PairListResponse,
  PairAgainstUserResponse,
} from './types'

import { ROUTER_PACKAGE_HASH } from '../../constant';

/**
 * Client for working with Caspwerswap API
 */
export class APIClient {
  constructor(
    private _baseURL: string
  ){}

  /**
   * Get the list of all tokens supported
   * 
   * @returns a list of tokens
   */
  async getTokenList(): Promise<TokenList> {
    const response = await axios.get(`${this._baseURL}/tokensList`)

    return response.data
  }

  /**
   * Get the list of all tokens supported
   * 
   * @returns a list of tokens
   */
   async getPairList(): Promise<PairListResponse> {
    const response = await axios.get(`${this._baseURL}/getpairlist`)

    return response.data
  }

  /**
   * Get the reserves for a specific path/pair
   * 
   * @param tokenASymbol first token
   * @param tokenBSymbol second token
   * 
   * @returns reserve data for path/pair
   */
  async getPathReserves(tokenASymbol: string, tokenBSymbol: string): Promise<PathReservesResponse> {
    const response = await axios.post(`${this._baseURL}/getpathreserves`, {
      path: [
          tokenASymbol === 'CSPR' ? 'WCSPR': tokenASymbol,
          tokenBSymbol === 'CSPR' ? 'WCSPR': tokenBSymbol,
      ]
    })

    if (!response.data.success) {
      throw new Error(response.data)
    }

    return response.data
  }

  /**
   * Get the liquidity pair path for swapping
   * @param tokenASymbol first token
   * @param tokenBSymbol second token
   * 
   * @returns the path for swapping
   */
  async getPath(tokenASymbol: string, tokenBSymbol: string): Promise<PathResponse> {
    const response = await axios.post(`${this._baseURL}/getpath`, {
      tokenASymbol: tokenASymbol === 'CSPR' ? 'WCSPR': tokenASymbol,
      tokenBSymbol: tokenBSymbol === 'CSPR' ? 'WCSPR': tokenBSymbol,
    })

    return response.data
  }
  /**
   * Get the latest deploy wasm data
   * 
   * @returns deploy wasm for special purse functions
   */
  async getDeployWasmData(): Promise<DeployWasmDataResponse> {
    const response = await axios.get(`${this._baseURL}/getWasmData`);

    return response.data
  }

  /**
   * Get the allowance for the router contract for a CEP-18 allowed by a user
   * 
   * @param ownerAccountHashHex owner's account hash string  
   * @param contractHash CEP-18 contract hash
   * 
   * @returns the allowance that the account hash has allowed the router contract for a specific CEP-18 contract
   */
  async getAllowanceAgainstOwnerAndSpender(ownerAccountHashHex: string, contractHash: string): Promise<AllowanceAgainstOwnerAndSpenderResponse> {

    const allowanceParam = {
      contractHash: contractHash.slice(5),
      owner: ownerAccountHashHex.slice(13),
      spender: ROUTER_PACKAGE_HASH,
    };

    const response = await axios.post(`${this._baseURL}/allowanceagainstownerandspender`, allowanceParam)

    return response.data
  }
  
  /**
   * Get the allowance for the router contract for a CEP-18 Pair allowed by a user
   * 
   * @param accountHashHex user account hash
   * @param pairPackageHash pair package hash
   * 
   * @returns the allowance that the account hash has allowed the router contract for a specific CEP-18 contract
   */
  async getAllowanceAgainstOwnerAndSpenderPairContract(accountHashHex: string, pairPackageHash: string): Promise<AllowanceAgainstOwnerAndSpenderResponse> {
    console.log('a', accountHashHex, 'p', pairPackageHash)
    const allowanceParam = {
      contractHash: pairPackageHash.slice(5),
      owner: accountHashHex.slice(13),
      spender: ROUTER_PACKAGE_HASH,
    };

    const response = await axios.post(`${this._baseURL}/allowanceagainstownerandspenderpaircontract`, allowanceParam)

    return response.data
  }
  
  /**
   * Get the user's liquidity for a specific pair
   * 
   * @param accountHashHex user account hash
   * @param pairPackageHash pair package hash
   * 
   * @returns the liquidity for a pair contract
   */
  async getLiquidityAgainstUserAndPair(accountHashHex: string, pairPackageHash: string): Promise<LiquidityAgainstUserAndPairResponse>{
    const liquidityParam = {
      to: accountHashHex.slice(13),
      pairid: pairPackageHash.slice(5),
    };

    const response = await axios.post(`${this._baseURL}/liquidityagainstuserandpair`, liquidityParam)

    return response.data
  }

  /**
   * Get the user's balance for a contract hash
   * 
   * @param accountHashHex user account hash
   * @param contractHash pair package hash
   * @returns the balance for a contract
   */
  async getBalanceAgainstUser(accountHashHex: string, contractHash: string): Promise<BalanceAgainstUserResponse>{
    const balanceParam = {
      user: accountHashHex.slice(13),
      contractHash: contractHash.slice(5),
    };

    const response = await axios.post(`${this._baseURL}/balanceagainstuser`, balanceParam)

    return response.data
  }

  /**
   * Get the user's pair balances
   * 
   * @param accountHashHex user account hash
   * @returns the pair balances for a user
   */
  async getPairAgainstUser(accountHashHex: string): Promise<PairAgainstUserResponse>{
    const pairParam = {
      user: accountHashHex.slice(13),
    };

    const response = await axios.post(`${this._baseURL}/getpairagainstuser`, pairParam)

    return response.data.success ? response.data : []
  }
}