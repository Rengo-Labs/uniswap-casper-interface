import { log } from '../utils'

import {
  CLPublicKey,
  Signer,
} from 'casper-js-sdk'

import {
  Wallet, 
} from './Wallet'

import { Network, WalletName } from './types'

/**
 * Mock Wallet
 */
export class MockWallet implements Wallet{
  private _publicKey?: CLPublicKey
  private _isConnected = false

  constructor(
    private _network: Network,
  ) {
    
  }

  // is the wallet connected?
  get isConnected(): boolean {
    return this._isConnected
  }
  
  // what network is the wallet connected to?
  get network(): Network {
    return this._network
  }

  // (getter) name for identifying the wallet
  get name(): WalletName {
    return WalletName.MOCK
  }

  // (getter) public key for connected wallet
  get publicKey(): CLPublicKey | undefined {
    return this._publicKey
  }

  // (getter) account hash string for UI
  get publicKeyHex(): string {
    return this._publicKey?.toHex() ?? ''
  }

  // (getter) account hash for connected wallet
  get accountHash(): Uint8Array | undefined {
    return this._publicKey?.toAccountHash()
  }

  // (getter) account hash string for UI
  get accountHashString(): string {
    return this._publicKey?.toAccountHashStr() ?? ''
  }

  /** 
   * Async try and connect to the current wallet
   * 
   * @returns the the public key on success or throw error
   */
  async connect(): Promise<string> {
    this._isConnected = true

    return ''
  }

    /** 
   * Async try and read the active key
   * 
   * @returns the the public key on success or throw error
   */
  async getActiveKey(): Promise<string> {
    return ''
  }

  /** 
   * Async try and disconnect from the current wallet
   * 
   * @returns a promise for pass/fail
   */
  disconnect(): void {
    if (!this.isConnected) {
      return
    }

    this._isConnected = false
  }
}