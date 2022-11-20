import Torus from "@toruslabs/casper-embed";
import store from 'store2'
import { log } from '../utils'

import {
  CLPublicKey,
  Signer,
} from 'casper-js-sdk'

import {
  Wallet, 
} from './Wallet'

import { WalletName, Network } from './types'

export const TORUS_WALLET_PUBKEY_KEY = 'tw-pubk'

const SUPPORTED_NETWORKS = {
  [Network.CASPER_MAINNET]: {
    blockExplorerUrl: "https://cspr.live",
    chainId: "0x1",
    displayName: "Casper Mainnet",
    logo: "https://cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: Network.CASPER_MAINNET,
  },
  [Network.CASPER_TESTNET]: {
    blockExplorerUrl: "https://testnet.cspr.live",
    chainId: "0x2",
    displayName: "Casper Testnet",
    logo: "https://testnet.cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://testnet.casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: Network.CASPER_TESTNET,
  },
};

/**
 * Torus Wallet
 */
export class TorusWallet implements Wallet {
  private _connectPromise?: Promise<string>
  private _connectEventHandler: any
  private _disconnectEventHandler: any
  private _previousConnectReject: any
  private _publicKey?: CLPublicKey
  private _isConnected = false
  private _torus?: Torus

  constructor(
    private _network: Network
  ){
    const pubKeyHex = store.get(TORUS_WALLET_PUBKEY_KEY)

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

  // what network is the wallet connected to?
  get network(): Network {
    return this._network
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
      // create new Torus instance
      const torus = this._torus = new Torus();
      // initialize the Torus instance
      await torus.init({
        // TODO: multiplex basedo n URL
        buildEnv: 'testing',
        showTorusButton: true,
        network: SUPPORTED_NETWORKS[this._network],
      })
      
      // login
      const loginaccs = await torus?.login();
      const zzz = (loginaccs || [])[0] || ""
      console.log('zzz', zzz)
      
    } catch (err) {
      log.error(`Torus Wallet - connect error: ${err}`)

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
    store.set(TORUS_WALLET_PUBKEY_KEY, key)

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