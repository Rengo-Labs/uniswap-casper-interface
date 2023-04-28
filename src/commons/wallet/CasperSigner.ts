import store from 'store2'
import { log } from '../utils'
import {
  CasperServiceByJsonRPC,
  CLPublicKey,
  DeployUtil,
  Signer,
} from 'casper-js-sdk'
import {
  Wallet,
} from './Wallet'
import { Network, WalletName } from './types'
import { NODE_ADDRESS } from '../../constant'
export const CASPERSIGNER_PUBKEY_KEY = 'cs-pubk'
import {globalStore} from "../../store/store";

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

  constructor(
    private _network: Network,
  ){
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
   * @returns the the public key hex on success or throw error
   */
  async getActiveKey(): Promise<string> {
    // fetch the key
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
  async disconnect(): Promise<void> {
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
      console.log("Signer", deploy)
      const deployJSON = DeployUtil.deployToJson(deploy)
      // Sign the deploy with the signer
      console.log("Tratando de aprobar signedDeployJSON Signer", this.publicKeyHex, deployJSON)
      const signedDeployJSON = await Signer.sign(
        deployJSON,
        this.publicKeyHex,
        this.publicKeyHex,
      )
      console.log("retorno signedDeployJSON", signedDeployJSON)
      // Convert the signed deploy json to a deploy
      return DeployUtil.deployFromJson(signedDeployJSON).unwrap()
    } catch (err) {
      log.error(`Casper Signer - signAndDeploy error: ${err}`)
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
      const { nodeUrl } = globalStore()
      const casperService = new CasperServiceByJsonRPC(nodeUrl || NODE_ADDRESS)
      return (await casperService.deploy(signedDeploy)).deploy_hash
    } catch (err) {
      log.error(`Casper Signer - signAndDeploy error: ${err}`)
      throw err
    }
  }
}
