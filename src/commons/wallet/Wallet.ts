import {
  CLPublicKey,
  DeployUtil,
  GetDeployResult,
  RuntimeArgs,
} from 'casper-js-sdk'
import { Deploy } from 'casper-js-sdk/dist/lib/DeployUtil'

import BigNumber from 'bignumber.js'
import { WalletName, Network } from './types'

/**
 * Wallet interface for all CasperSwap wallets
 */
export interface Wallet {
  // is the wallet connected?
  isConnected: boolean
  // (getter) what network is the wallet connected to?
  network: Network
  // (getter) name for identifying the wallet
  name: WalletName
  // (getter) public key for connected wallet
  publicKey: CLPublicKey | undefined
  // (getter) account hash string for UI
  publicKeyHex: string
  // (getter) account hash for connected wallet
  accountHash: Uint8Array | undefined
  // (getter) account hash string for UI
  accountHashString: string
  
  /** 
   * Async try and connect to the current wallet
   * 
   * @returns the the public key on success or throw error
   */
  connect: (dispatch?) => Promise<string>

  /** 
   * Async try and read the active key
   * 
   * @returns the the public key on success or throw error
   */
  getActiveKey: () => Promise<string>

  /** 
   * Async try and disconnect from the current wallet
   * 
   * @returns a promise for pass/fail
   */
  disconnect: () => Promise<void>

  /**
   * Sign a deploy
   * 
   * @params deploy Deploy to sign
   * 
   * @returns a signed deploy
   */
  sign: (deploy: DeployUtil.Deploy) => Promise<DeployUtil.Deploy>

  /**
   * Deploy a signed deploy
   * 
   * @params deploy Deploy to deploy
   * 
   * @returns a deploy hash
   */
  deploy: (deploy: DeployUtil.Deploy) => Promise<string>
}