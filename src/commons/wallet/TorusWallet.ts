import Torus from "@toruslabs/casper-embed";
import store from 'store2'
import { log } from '../utils'

import {
  CasperServiceByJsonRPC,
  CLPublicKey, DeployUtil,
} from 'casper-js-sdk'

import {
  Wallet, 
} from './Wallet'

import { WalletName, Network } from './types'
import { SafeEventEmitterProvider } from "casper-js-sdk/dist/services/ProviderTransport";

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
        log.warn(`Torus Wallet - constructor warning, could not decode cached hex: ${pubKeyHex}`)
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
    return WalletName.TORUS
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
      let torus = this._torus

      if (!torus) {
        // create new Torus instance
        torus = this._torus = new Torus()
        // initialize the Torus instance
        await torus.init({
          // TODO: multiplex based on URL
          buildEnv: 'testing',
          showTorusButton: true,
          network: SUPPORTED_NETWORKS[this._network],
        })

        torus.showTorusButton()
      }
      
      // login
      const loginaccs = await torus?.login()
      const key = (loginaccs || [])[0] || ""

      // store key
      store.set(TORUS_WALLET_PUBKEY_KEY, key)
      
      // set the key
      this._publicKey = CLPublicKey.fromHex(key)

      // we are connected
      this._isConnected = true
    } catch (err) {
      log.error(`Torus Wallet - connect error: ${err}`)

      // rethrow error
      throw err
    }
  }

  /** 
   * Async try and read the active key
   * 
   * @returns the the public key hex on success or throw error
   */
  async getActiveKey(): Promise<string> {
    return this.publicKeyHex
  }
  
  /** 
   * Async try and disconnect from the current wallet
   * 
   * @returns a promise for pass/fail
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    try {
      this._torus.hideTorusButton()

      return await this._torus.logout()
    } catch (err) {
      log.error(`Torus Wallet - disconnect error, probably disconnecting from a disconnected signer: ${err}`)
      
      // rethrow error
      throw err
    }
  }

  /**
   * Sign a deploy
   * 
   * @params deploy Deploy to sign
   * 
   * @returns a signed deploy
   */
  async sign(deploy: DeployUtil.Deploy): Promise<DeployUtil.Deploy> {
    // Torus does the signing and deploy in one go
    return deploy 
  }
  
  /**
   * Deploy a signed deploy
   * 
   * @params deploy Signed deploy to deploy
   * 
   * @returns a deploy hash
   */
  async deploy(signedDeploy: DeployUtil.Deploy): Promise<string> {
    try {
      const casperService = new CasperServiceByJsonRPC(this._torus?.provider as SafeEventEmitterProvider)
      return (await casperService.deploy(signedDeploy)).deploy_hash
    } catch (err) {
      log.error(`Torus Wallet - signAndDeploy error: ${err}`)
      throw err
    }
  }
}