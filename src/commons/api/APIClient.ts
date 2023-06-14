import axios from 'axios'
import {
  CasperServiceByJsonRPC,
  CLByteArray,
  Contracts,
} from 'casper-js-sdk'
import {
  PathResponse,
} from './types'
import {
  Client as CasperClient,
} from '../wallet'
import { NODE_ADDRESS } from '../../constant'
import { ROUTER_PACKAGE_HASH } from '../../constant';
import {Wallet} from "../wallet";
import { getPath } from '../calculations'
import { initialTokenState } from '../../reducers/TokenReducers'
import { ERC20Client } from 'casper-erc20-js-client'
const { Contract } = Contracts
import {globalStore} from "../../store/store";
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
    private _client: CasperClient,
  ){
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

    const path = getPath(token0, token1).map(x => initialTokenState.tokens[x.id].packageHash)

    //console.log('path', path)

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
  async getDeployWasmData(): Promise<ArrayBuffer> {
    const response = await axios.get(`/session-code-router.wasm`, {
      responseType: 'arraybuffer',
    });

    //console.log('getDeployWasmData', response.data)

    return response.data
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
      //console.log(contractHash, dictionaryKey, itemKey, srh)
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
    const erc20 = new ERC20Client(
      this._client.node,
      this._client.network,
    );

    await erc20.setContractHash(contractHash)

    return erc20.balanceOf(wallet.publicKey)
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
    if (contractHash == null) return;

    const erc20 = new ERC20Client(
      this._client.node,
      this._client.network,
    );

    await erc20.setContractHash(contractHash)

    const spender = ROUTER_PACKAGE_HASH;
    const spenderByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
    )

    return erc20.allowances(wallet.publicKey, spenderByteArray)
  }

  async getERC20GaugeAllowance(wallet: Wallet, contractHash: string, packageHash: string): Promise<string> {
    if (contractHash == null) return;

    const erc20 = new ERC20Client(
      this._client.node,
      this._client.network,
    );

    await erc20.setContractHash(contractHash)

    const packageHashByteArray = new CLByteArray(
      Uint8Array.from(Buffer.from(packageHash.slice(5), "hex"))
    )

    return erc20.allowances(wallet.publicKey, packageHashByteArray)
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
   async getPairData(contractHash: string, stateRootHash?: string): Promise<PairDataResponse> {
     // TODO: check if the node url global store is set
    const nodeUrl = globalStore.getState().nodeUrl;
    // set up the service
    const casperService = new CasperServiceByJsonRPC(nodeUrl || NODE_ADDRESS)

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
        reserve0: reserve0?.CLValue?.isCLValue ? reserve0?.CLValue?.value().toString() : '0',
        reserve1: reserve1?.CLValue?.isCLValue ? reserve1?.CLValue?.value().toString() : '0',
        totalSupply: totalSupply?.CLValue?.isCLValue ? totalSupply?.CLValue?.value().toString() : '0'
      }
    } catch (e) {
      //console.log('get pair data error', e)

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
        this.getERC20Allowance(wallet, contractHash, srh).catch(e => '0'),
        this.getERC20Balance(wallet, contractHash, srh),
      ])

      return {
        allowance,
        balance,
      }
    } catch (e) {
      //console.log('get pair user data error', e)

      return {
        allowance: '0',
        balance: '0',
      }
    }
  }

  /**
   * Get the latest deploy wasm data
   *
   * @returns deploy wasm for special purse functions
   */
  async getWCSPRWasmData(): Promise<ArrayBuffer> {
    const response = await axios.get(`/session-code-wcspr.wasm`, {
      responseType: 'arraybuffer',
    });

    return response.data
  }
}
