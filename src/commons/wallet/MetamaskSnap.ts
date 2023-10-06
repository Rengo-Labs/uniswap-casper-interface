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
import { getAccount, getSnap, installSnap, signDeploy } from '@casperholders/casper-snap-helper';

const SNAP_ID = 'npm:@casperholders/casper-snap';

export const METAMASKSNAP_PUBKEY_KEY = 'ms-pubk'

/**
 * Metamask Wallet
 */
export class MetamaskSnapWallet implements Wallet{
  private _connectPromise?: Promise<string>
  private _previousConnectReject: any
  private _publicKey?: CLPublicKey
  private _isConnected = false

  constructor(
    private _network: Network,
  ){
    const pubKeyHex = store.get(METAMASKSNAP_PUBKEY_KEY)

    if (pubKeyHex) {
      try {
        this._publicKey = CLPublicKey.fromHex(pubKeyHex)
      } catch(e) {
        log.warn(`Metamask Snap - constructor warning, could not decode cached hex: ${pubKeyHex}`)
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
    return WalletName.METAMASK_FLASK
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
      // get the active key
      await installSnap(SNAP_ID);
      await getSnap(SNAP_ID);
      await this.getActiveKey()

      this._isConnected = true
      log.info('MetaMask: Connected')
    } catch (err) {
      log.error(`Metamask - connect error: ${err}`)
      // rethrow error
      throw err
    }
  }

  /**
   * Async try and read the active key
   *
   * @returns the the public key hex on success or throw error
   */
  async getActiveKey(addressIndex = 0): Promise<string> {
    // fetch the key
    const key = await getAccount(addressIndex, SNAP_ID);

    // store key
    store.set(METAMASKSNAP_PUBKEY_KEY, key)

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
    this._isConnected = false
  }

  /**
   * Sign a deploy
   *
   * @params deploy Deploy to sign
   *
   * @returns a signed deploy
   */
  async sign(deploy: DeployUtil.Deploy): Promise<DeployUtil.Deploy> {
    try {
      return await signDeploy(deploy, {
        addressIndex: 0,
        publicKey: this.publicKeyHex,
        snapID: SNAP_ID,
      })
    } catch (err) {
      log.error(`Metamask - signAndDeploy error: ${err}`)
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
      const casperService = new CasperServiceByJsonRPC(NODE_ADDRESS)
      return (await casperService.deploy(signedDeploy)).deploy_hash
    } catch (err) {
      log.error(`Metamask - signAndDeploy error: ${err}`)
      throw err
    }
  }
}
