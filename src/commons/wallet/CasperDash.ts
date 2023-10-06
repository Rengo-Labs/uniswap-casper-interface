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
import {globalStore} from "../../store/store";
import {ConfigActions} from "../../reducers";
import {CasperWalletEvents} from "./CasperWallet";

export const CASPER_DASH_PUB_KEY = 'cd-pubk'

export enum CasperDashEvents {
  CONNECT = 'casperdash:connected',
  DISCONNECT = 'casperdash:disconnected',
  ACTIVE_WALLET = 'casperdash:activeKeyChanged'
}

export type WalletState = {
  isLocked: boolean;
  isConnected: boolean;
  activeKey: string;
};

/**
 * Casper Wallet
 */
export class CasperDash implements Wallet{
  private _connectPromise?: Promise<string>
  private _connectEventHandler: any
  private _activeWallet: any
  private _disconnectEventHandler: any
  private _previousConnectReject: any
  private _publicKey?: CLPublicKey
  private _isConnected = false

  private _casperDashInstance = null;

  constructor(
    private _network: Network,
  ){
    const pubKeyHex = store.get(CASPER_DASH_PUB_KEY)

    if (pubKeyHex) {
      try {
        this._publicKey = CLPublicKey.fromHex(pubKeyHex)
      } catch(e) {
        log.warn(`Casper Dash - constructor warning, could not decode cached hex: ${pubKeyHex}`)
      }
    }
  }

  getCasperDashInstance = () => {
    try {
      if (this._casperDashInstance == null) {
        this._casperDashInstance = (window as any).casperDashHelper;
      }
      return this._casperDashInstance;
    } catch (err) {}
    throw Error('Please install the Casper Dash Extension.');
  };


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
  async connect(dispatch = null): Promise<string> {
    if (this.isConnected) {
      return
    }

    try {
      // check if we're connected
      const signerIsConnected = await this.getCasperDashInstance().isConnected()

      if (dispatch != null) {
        // detect when the account switched
        this._activeWallet = async (event: CustomEventInit<{ activeKey: string; isConnected: boolean }>) => {
          try {

            await this.getActiveKey()

            dispatch({
              type: ConfigActions.SELECT_MAIN_PURSE,
              payload: { mainPurse: event.detail?.activeKey  },
            });

            dispatch({
              type: ConfigActions.CONNECT_WALLET,
              payload: { wallet: this },
            });
          } catch (err) {
            console.error(err);
          }
        }

        window.addEventListener(
          CasperDashEvents.ACTIVE_WALLET,
          this._activeWallet,
        );
      }

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
            CasperDashEvents.CONNECT,
            this._connectEventHandler,
          )
        }

        // if there is a disconnect event handler then stop listening to it
        if (this._disconnectEventHandler) {
          window.removeEventListener(
            CasperDashEvents.DISCONNECT,
            this._disconnectEventHandler,
          )
        }

        // create a new connect event handler
        this._connectEventHandler = async (msg) => {
          try {
            // get the active key
            const key = await this.getActiveKey()

            this._isConnected = true
            log.info('CasperWallet: Connected')
            this._connectEventHandler = undefined
            this._connectPromise = undefined

            resolve(key)
          } catch (err) {
            log.error(`CasperWallet - connect error: ${err}`)
          }
        }

        // create a new disconnect event handler
        this._disconnectEventHandler = (msg) => {
          this._isConnected = false
          log.info('CasperWallet: Disconnected')
          this._disconnectEventHandler = undefined
        }

        // start litening to connect
        window.addEventListener(
          CasperDashEvents.CONNECT,
          this._connectEventHandler,
          { once: true },
        )

        // start listening to disconnect
        window.addEventListener(
          CasperDashEvents.DISCONNECT,
          this._disconnectEventHandler,
          { once: true },
        )
      })

      // finally try and connect
      await this.getCasperDashInstance().requestConnection()

      // return the connect promise
      return this._connectPromise
    } catch (err) {
      log.error(`Casper Wallet - connect error: ${err}`)
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
    const key = await this.getCasperDashInstance().getActivePublicKey()

    // store key
    store.set(CASPER_DASH_PUB_KEY, key)

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
      window.removeEventListener(
        CasperWalletEvents.ACTIVE_WALLET,
        this._activeWallet,
      )
      return this.getCasperDashInstance().disconnectFromSite();
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
  async sign(deploy: DeployUtil.Deploy): Promise<DeployUtil.Deploy> {
    try {
      // Convert the deploy to a raw json
      const deployJSON = DeployUtil.deployToJson(deploy)
      // Sign the deploy with the signer

      const signedDeployJSON = await this.getCasperDashInstance().sign(deployJSON, this.publicKeyHex, this.publicKeyHex);
      // Convert the signed deploy json to a deploy
      return DeployUtil.deployFromJson(signedDeployJSON).unwrap()
    } catch (err) {
      log.error(`Casper Wallet - signAndDeploy error: ${err}`)
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
