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

export const CASPER_WALLET_PUB_KEY = 'cw-pubk'

export enum CasperWalletEvents {
  CONNECT = 'casper-wallet:connected',
  DISCONNECT = 'casper-wallet:disconnected',
  ACTIVE_WALLET = 'casper-wallet:activeKeyChanged'
}

export type WalletState = {
  isLocked: boolean;
  isConnected: boolean;
  activeKey: string;
};

/**
 * Casper Wallet
 */
export class CasperWallet implements Wallet{
  private _connectPromise?: Promise<string>
  private _connectEventHandler: any
  private _activeWallet: any
  private _disconnectEventHandler: any
  private _previousConnectReject: any
  private _publicKey?: CLPublicKey
  private _isConnected = false

  private _casperWalletInstance = null;

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

  getCasperWalletInstance = () => {
    try {
      if (this._casperWalletInstance == null) {
        this._casperWalletInstance = (window as any).CasperWalletProvider();
      }
      return this._casperWalletInstance;
    } catch (err) {}
    throw Error('Please install the Casper Wallet Extension.');
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
      const signerIsConnected = await this.getCasperWalletInstance().isConnected()

      if (dispatch != null) {
        // detect when the account switched
        this._activeWallet = async (msg) => {
          try {
            const action: WalletState = JSON.parse(msg.detail);

            await this.getActiveKey()

            dispatch({
              type: ConfigActions.SELECT_MAIN_PURSE,
              payload: { mainPurse: action.activeKey },
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
          CasperWalletEvents.ACTIVE_WALLET,
          this._activeWallet,
        )
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
            CasperWalletEvents.CONNECT,
            this._connectEventHandler,
          )
        }

        // if there is a disconnect event handler then stop listening to it
        if (this._disconnectEventHandler) {
          window.removeEventListener(
            CasperWalletEvents.DISCONNECT,
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
          CasperWalletEvents.CONNECT,
          this._connectEventHandler,
          { once: true },
        )

        // start listening to disconnect
        window.addEventListener(
          CasperWalletEvents.DISCONNECT,
          this._disconnectEventHandler,
          { once: true },
        )
      })

      // finally try and connect
      await this.getCasperWalletInstance().requestConnection()

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
    const key = await this.getCasperWalletInstance().getActivePublicKey()

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
      window.removeEventListener(
        CasperWalletEvents.ACTIVE_WALLET,
        this._activeWallet,
      )
      return this.getCasperWalletInstance().disconnectFromSite();
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
      const deployJSON = DeployUtil.deployToJson(deploy)
      // Sign the deploy with the signer
      const signedDeployJSON = await this.getCasperWalletInstance().sign(JSON.stringify(deployJSON), this.publicKeyHex.toLowerCase())

      // Convert the signed deploy json to a deploy
      return DeployUtil.setSignature(
        deploy,
        signedDeployJSON.signature,
        CLPublicKey.fromHex(this.publicKeyHex)
      )
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
