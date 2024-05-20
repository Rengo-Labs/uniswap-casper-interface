import store from 'store2'
import { log } from '../utils'

import {
  CasperServiceByJsonRPC,
  CLPublicKey,
  DeployUtil,
} from 'casper-js-sdk'

import {
  Wallet,
} from './Wallet'

import { Network, WalletName } from './types'
import { NODE_ADDRESS } from '../../constant'
import {globalStore} from "../../store/store"
import CSPRClickSDK from "@make-software/csprclick-core-client/sdk"
import {SendResult} from "@make-software/csprclick-core-client/types";

export const CASPER_WALLET_PUB_KEY = 'cw-pubk'

export type WalletState = {
  isLocked: boolean;
  isConnected: boolean;
  activeKey: string;
};

/**
 * Casper Wallet
 */
export class ClickWallet implements Wallet{
  private _connectPromise?: Promise<string>
  private _publicKey?: CLPublicKey
  private _isConnected = false
  private _clickRef?: CSPRClickSDK

  constructor(
    private _network: Network,
  ){
    const pubKeyHex = store.get(CASPER_WALLET_PUB_KEY)

    if (pubKeyHex) {
      try {
        this._publicKey = CLPublicKey.fromHex(pubKeyHex)
      } catch(e) {
        log.warn(`Casper Wallet - constructor warning, could not decode cached hex: ${pubKeyHex}`)
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

  get clickRef(): CSPRClickSDK {
    return this._clickRef
  }

  setClickRef(clickRef) {
    this._clickRef = clickRef
  }

  /**
   * Async try and connect to the current wallet
   *
   * @returns the the public key on success or throw error
   */
  connect() {
    if (this.isConnected) {
      return
    }

    try {

      this._isConnected = true
      // return the connect promise
      return this._connectPromise
    } catch (err) {
      log.error(`Click Wallet - connect error: ${err}`)
      this._connectPromise = undefined

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
    // fetch the key
    const key = this._clickRef?.getActiveAccount().public_key

    // store key
    store.set(CASPER_WALLET_PUB_KEY, key)

    // convert key to CLPublicKey type
    this._publicKey = CLPublicKey.fromHex(key)

    return key
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
      this._isConnected = false
      return this._clickRef.disconnect(store.get(CASPER_WALLET_PUB_KEY))
    } catch (err) {
      log.error(`Casper Signer - disconnect error, probably disconnecting from a disconnected signer: ${err}`)

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
  async sign(deploy: DeployUtil.Deploy): Promise<DeployUtil.Deploy | SendResult> {
    try {
      const deployJSON = DeployUtil.deployToJson(deploy)
      // Sign the deploy with the signer
      const activePK = this._clickRef.getActiveAccount().public_key

      const sendDeployJSON = await this._clickRef.send(JSON.stringify(deployJSON.deploy), activePK)

      // Convert the signed deploy json to a deploy
      return sendDeployJSON
    } catch (err) {
      log.error(`Click Wallet - signAndDeploy error: ${err}`)
      throw err
    }
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
      // TODO: check if the node url global store is set
      const nodeUrl = globalStore.getState().nodeUrl;
      const casperService = new CasperServiceByJsonRPC(nodeUrl || NODE_ADDRESS)
      return (await casperService.deploy(signedDeploy)).deploy_hash
    } catch (err) {
      log.error(`Casper Signer - signAndDeploy error: ${err}`)
      throw err
    }
  }
}
