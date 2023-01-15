import axios from 'axios'

import { 
  CasperServiceByJsonRPC,
  CLValueParsers, 
  Contracts,
} from 'casper-js-sdk'

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

import {
  Client as CasperClient,
} from '../wallet'

import {
  createRecipientAddress,
} from '../utils'

import { NODE_ADDRESS } from '../../constant'

import { ROUTER_PACKAGE_HASH } from '../../constant';
import {Wallet} from "../wallet";

import { getPath } from '../calculations'

const { Contract } = Contracts

export const enum ERC20Keys {
  TOTAL_SUPPLY = 'total_supply',
}

export const enum ERC20Dictionaries {
  BALANCES = 'balances',
  ALLOWANCES = 'allowances'
}

export const enum PairKeys {
  RESERVE0 = 'reserve0',
  RESERVE1 = 'reserve1',  
  LIQUIDITY = 'liquidity',
}

export interface PairDataResponse {
  reserve0: string 
  reserve1: string
  totalSupply: string
}

export interface PairUserDataResponse {
  balance: string
  allowance: string
}

/**
 * Client for working with Caspwerswap API
 */
export class APIClient {

  constructor(
    private _baseURL: string,
    private _client: CasperClient,
  ){
  }

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
    const token0 = tokenASymbol === 'CSPR' ? 'WCSPR': tokenASymbol
    const token1 = tokenBSymbol === 'CSPR' ? 'WCSPR': tokenBSymbol

    const path = getPath(token0, token1).slice(1).map(x => x.label)

    console.log('path', )

    return {
      message: '',
      path,
      pathwithcontractHash: path,
      success: true,
    }
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

  

  /**
   * Get the user's balances
   * 
   * @param wallet user wallet
   * @param contractHash contract hash
   * @param dictionaryKey dictionary's key
   * @param itemKey item's key in dictionary
   * @param stateRootHash optional state root hash
   * 
   * @returns the dictionary item
   */
   async getDictionaryItem(contractHash: string, dictionaryKey: string, itemKey: string, stateRootHash?: string): Promise<string> {
    // set up the contract client
    const contractClient = new Contract(this._client.casperClient)
    contractClient.setContractHash(contractHash)

    let srh = stateRootHash ?? ''

    if (!srh) {
      srh = await this._client.getStateRootHash()
    }
    
    try {
      const result = await contractClient.queryContractDictionary(
        dictionaryKey,
        itemKey,
        srh,
      )

      return result.toString()
    } catch (e) {
      console.log(contractHash, dictionaryKey, itemKey, srh)
      console.log('get erc20 get dictionary error', e)
      throw e
    }
  }

  /**
   * Get the user's balances
   * 
   * @param wallet user wallet
   * @param contract hash contract hash
   * @param stateRootHash optional state root hash
   * 
   * @returns the balance as a string
   */
  async getERC20Balance(wallet: Wallet, contractHash: string, stateRootHash?: string): Promise<string> {
    // set up the contract client
    const contractClient = new Contract(this._client.casperClient)
    contractClient.setContractHash(contractHash)

    const ownerKey = createRecipientAddress(wallet.publicKey)

    const keyBytes = CLValueParsers.toBytes(ownerKey).unwrap();
    const itemKey = Buffer.from(keyBytes).toString("base64");
    
    try {
      return this.getDictionaryItem(
        contractHash, 
        ERC20Dictionaries.BALANCES, 
        itemKey, 
        stateRootHash
      )
    } catch (e) {
      console.log('get erc20 balance error', e)
      return '0'
    }
  }

  /**
   * Get the user's allowance
   * 
   * @param wallet user wallet
   * @param contract hash contract hash
   * @param stateRootHash optional state root hash
   * 
   * @returns the allowance as a string
   */
  async getERC20Allowance(wallet: Wallet, contractHash: string, stateRootHash?: string): Promise<string> {
    // set up the contract client
    const contractClient = new Contract(this._client.casperClient)
    contractClient.setContractHash(contractHash)

    const ownerKey = createRecipientAddress(wallet.publicKey)

    const keyBytes = CLValueParsers.toBytes(ownerKey).unwrap();
    const itemKey = Buffer.from(keyBytes).toString("base64");
    
    try {
      return this.getDictionaryItem(contractHash, ERC20Dictionaries.ALLOWANCES, itemKey, stateRootHash)
    } catch (e) {
      console.log('get erc20 balance error', e)
      return '0'
    }
  }

  /**
   * Get the pair data
   * 
   * @param wallet user wallet
   * @param contract hash contract hash
   * @param stateRootHash optional state root hash
   * 
   * @returns the a PairDataResponse
   */
   async getPairData(wallet: Wallet, contractHash: string, stateRootHash?: string): Promise<PairDataResponse> {
    // set up the service
    const casperService = new CasperServiceByJsonRPC(NODE_ADDRESS)
    
    let srh = stateRootHash ?? ''

    if (!srh) {
      srh = await this._client.getStateRootHash()
    }
    
    try {
      const [reserve0, reserve1, totalSupply]: any[] = await Promise.all([
        casperService.getBlockState(
          srh,
          contractHash,
          [PairKeys.RESERVE0],
        ),
        casperService.getBlockState(
          srh,
          contractHash,
          [PairKeys.RESERVE1],
        ),
        casperService.getBlockState(
          srh,
          contractHash,
          [ERC20Keys.TOTAL_SUPPLY],
        )
      ])

      return {
        reserve0: reserve0?.CLValue?.isCLValue ? reserve0?.CLValue?.value() : '0',
        reserve1: reserve1?.CLValue?.isCLValue ? reserve0?.CLValue?.value() : '0',
        totalSupply: totalSupply?.CLValue?.isCLValue ? totalSupply?.CLValue?.value() : '0'
      }
    } catch (e) {
      console.log('get pair data error', e)

      return {
        reserve0: '0',
        reserve1: '0',
        totalSupply: '0',
      }
    }
  }

  /**
   * Get the user's pair data
   * 
   * @param wallet user wallet
   * @param contract hash contract hash
   * @param stateRootHash optional state root hash
   * 
   * @returns the a PairUserDataResponse
   */
   async getPairUserData(wallet: Wallet, contractHash: string, stateRootHash?: string): Promise<PairUserDataResponse> {   
    let srh = stateRootHash ?? ''

    if (!srh) {
      srh = await this._client.getStateRootHash()
    }
    
    try {
      const [allowance, balance]: any[] = await Promise.all([
        this.getERC20Balance(wallet, contractHash, srh),
        this.getERC20Allowance(wallet, contractHash, srh),        
      ])

      return {
        allowance,
        balance,
      }
    } catch (e) {
      console.log('get pair data error', e)

      return {
        allowance: '0',
        balance: '0',
      }
    }
  }
}