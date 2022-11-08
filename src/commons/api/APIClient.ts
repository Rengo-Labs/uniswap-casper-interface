import axios from 'axios'

import { 
  DeployWasmDataResponse,
  Token,
  TokenList,
  PathResponse,
  PathReservesResponse,
} from './types'

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
}