import store from 'store2'
import { log } from '../utils'

import {
  CLPublicKey,
  Signer,
} from 'casper-js-sdk'

import {
  Wallet, 
} from './Wallet'

import { WalletName } from './types'

export const CASPERSIGNER_PUBKEY_KEY = 'cs-pubk' 

/**
 * Casper Signer Wallet
 */
export class CasperSignerWallet implements Wallet{
  private _connectPromise?: Promise<string>
  private _publicKey?: CLPublicKey
  private _isConnected = false

  constructor(){
    const pubKeyHex = store.get(CASPERSIGNER_PUBKEY_KEY)

    if (pubKeyHex) {
      try {
        this._publicKey = CLPublicKey.fromHex(pubKeyHex)
      } catch(e) {
        log.warn(`Casper Signer - constructor warning, could not decode cached hex: ${pubKeyHex}`)
      }
    }
  }

  // is the wallet connected?
  get isConnected(): boolean {
    return this._isConnected
  }

  // (getter) name for identifying the wallet
  get name(): WalletName {
    return WalletName.CasperSigner
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
    // if connecting just return the connect promise
    if (this._connectPromise) {
      return this._connectPromise
    }

    try {
      // clear the promise
      this._connectPromise = Signer.getActivePublicKey()

      // get key
      const key = await this._connectPromise

      // store key
      store.set(CASPERSIGNER_PUBKEY_KEY, key)

      // convert key to CLPublicKey type
      this._publicKey = CLPublicKey.fromHex(key)

      // clear the promise
      this._connectPromise = undefined

      // set connected
      this._isConnected = true

      return key
    } catch (err) {
      log.error(`Casper Signer - connect error: ${err}`)
      this._connectPromise = undefined

      // rethrow error
      throw err
    }
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

    try {
      return Signer.disconnectFromSite()
    } catch (err) {
      log.error(`Casper Signer - disconnect error, probably disconnecting from a disconnected signer: ${err}`)
      
      // rethrow error
      throw err
    }
  }
}