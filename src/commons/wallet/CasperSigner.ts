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

export enum CasperSignerEvents {
  CONNECT = 'signer:connected',
  DISCONNECT = 'signer:disconnected'
}

/**
 * Casper Signer Wallet
 */
export class CasperSignerWallet implements Wallet{
  private _connectPromise?: Promise<string>
  private _connectEventHandler: any
  private _disconnectEventHandler: any
  private _previousConnectReject: any
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
    return WalletName.CASPER_SIGNER
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
    if (this.isConnected) {
      return
    }

    // If connecting just return the connect promise
    if (this._connectPromise) {
      return this._connectPromise
    }

    try {
      // check if we're connected 
      const signerIsConnected = await Signer.isConnected()

      // if it is connected then set connect to true
      if (signerIsConnected) {
        this._isConnected = true
        return
      }

      this._connectPromise = new Promise((resolve, reject) => {
        // reject any previous promises if they exist
        if (this._previousConnectReject) {
          this._previousConnectReject()
          this._previousConnectReject = undefined
        }

        // set the new promise reject
        this._previousConnectReject = reject

        // if there is a connect event handler then stop listening to it
        if (this._connectEventHandler) {
          window.removeEventListener(
            CasperSignerEvents.CONNECT, 
            this._connectEventHandler,
          )
        }

        // if there is a disconnect event handler then stop listening to it
        if (this._disconnectEventHandler) {
          window.removeEventListener(
            CasperSignerEvents.DISCONNECT, 
            this._disconnectEventHandler,
          )
        }
        
        // create a new connect event handler
        this._connectEventHandler = async (msg) => {
          try {
            // get the active key
            const key = await this.getActiveKey()
            
            this._isConnected = true
            log.info('CasperSigner: Connected')
            this._connectEventHandler = undefined
            this._connectPromise = undefined

            resolve(key)
          } catch (err) {
            log.error(`Casper Signer - connect error: ${err}`)
          }
        }

        // create a new disconnect event handler
        this._disconnectEventHandler = (msg) => {
          this._isConnected = false
          log.info('CasperSigner: Disconnected')
          this._disconnectEventHandler = undefined
        }

        // start litening to connect
        window.addEventListener(
          CasperSignerEvents.CONNECT, 
          this._connectEventHandler, 
          { once: true },
        )
        
        // start listening to disconnect
        window.addEventListener(
          CasperSignerEvents.DISCONNECT, 
          this._disconnectEventHandler, 
          { once: true },
        )
      })      

      // finally try and connect
      Signer.sendConnectionRequest()

      // return the connect promise
      return this._connectPromise
    } catch (err) {
      log.error(`Casper Signer - connect error: ${err}`)
      this._connectPromise = undefined

      // rethrow error
      throw err
    }
  }

  /** 
   * Async try and read the active key
   * 
   * @returns the the public key on success or throw error
   */
  async getActiveKey(): Promise<string> {
    // clear the promise
    const key = await Signer.getActivePublicKey()

    // store key
    store.set(CASPERSIGNER_PUBKEY_KEY, key)

    // convert key to CLPublicKey type
    this._publicKey = CLPublicKey.fromHex(key)

    return key
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