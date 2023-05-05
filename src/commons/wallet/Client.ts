import { Buffer } from 'buffer'
import {
  CasperClient,
  CLPublicKey,
  decodeBase16,
  DeployUtil,
  GetDeployResult,
  RuntimeArgs,
} from 'casper-js-sdk'
import BigNumber from 'bignumber.js';

import { Wallet } from './Wallet'
import { Network } from './types'
import { log, sleep } from '../utils'
import {ROUTER_PACKAGE_HASH} from "../../constant";

/**
 * Client for working with Casper network
 */
export class Client {
  // Casper sdk client
  casperClient: CasperClient

  /**
   * Create a casper client
   * 
   * @param _network network type
   * @param _node node address
   */
  constructor(
    private _network: Network,
    private _node = '',
  ) {
    this.casperClient = new CasperClient(_node)
  }

  /**
   * @returns network
   */
  get network(): Network {
    return this._network
  }

  /**
   * @returns node addres
   */
  get node(): string {
    return this._node
  }
  
  /**
   * Async attempt to retrieve latest balance
   * 
   * @param wallet wallet whose public key is being used
   * 
   * @returns the balance as a decimal representation or throw error
   */
  async getBalance(wallet: Wallet): Promise<BigNumber> {
    try {
      const casperClient = this.casperClient
      const balance: any = await casperClient.balanceOfByPublicKey(wallet.publicKey as CLPublicKey)

      return new BigNumber(balance.toString())
    } catch(err) {
      log.warn(`Casper Client - getBalaance error: ${err}`)
      
      // rethrow error
      throw err
    }
  }

  /**
   * Async attempt to retrieve the state root hash
   * 
   * @returns the state root hash or throw error
   */
  async getStateRootHash(): Promise<string> {
    const casperService = this.casperClient.nodeClient
    
    return casperService.getStateRootHash();
  }

  /**
   * Async attempt to retrieve main purse
   * 
   * @param wallet wallet whose public key is being used
   * 
   * @returns the main purse or throw error
   */
   async getMainPurse(wallet: Wallet): Promise<string> {
    try {
      const casperService = this.casperClient.nodeClient

      const stateRootHash = await this.getStateRootHash()
      const result = await casperService.getBlockState(
          stateRootHash,
          wallet.accountHashString,
          []
      );
      const mainPurse = result.Account.mainPurse

      return mainPurse
    } catch(err) {
      log.warn(`Casper Client - getMainPurse error: ${err}`)
      
      // rethrow error
      throw err
    }
  }

  /**
   * Async attempt to retrieve deploy
   * 
   * @param deployHash string deploy hash
   * 
   * @returns the an array with deploy and deploy result or throw error
   */
  async getDeploy(deployHash: string, ticks = 5): Promise<[DeployUtil.Deploy, GetDeployResult]> {
    try {
      
      let deployCheck = 0
      // Get the deploy hash from the network
      
      while (deployCheck < ticks) {
        try {
          const casperClient = this.casperClient
          return await casperClient.getDeploy(deployHash)          
        } catch(e) {
          deployCheck++
          await sleep(1000)
        }
      }
      throw new Error('Could not confirm deploy.')
    } catch(err) {
      log.error(`Casper Client - getDeploy error: ${err}`)
      
      // rethrow error
      throw err
    }
  }

  /**
   * Async attempt to retrieve deploy but wits until the deploy execution is completed
   * 
   * @param deployHash string deploy hash
   * @param ticks number of times before giving up
   * 
   * @returns the an array with deploy and deploy result or throw error
   */
  async waitForDeployExecution(deployHash: string, ticks = 1000): Promise<[DeployUtil.Deploy, GetDeployResult]> {
    const casperClient = this.casperClient

    let i = 0
    while (i !== ticks) {
      try {
        const [deploy, raw] = await casperClient.getDeploy(deployHash);
        if (raw.execution_results.length !== 0) {
          if (raw.execution_results[0].result.Success) {
            return [deploy, raw];
          } else {
            throw Error(
              "Contract execution: " +
              raw.execution_results[0].result.Failure?.error_message
            );
          }
        } else {
          i++
          await sleep(1000)
        }
      } catch (e){
        i++
        await sleep(1000)
      }      
    }
    throw Error("Timeout after " + i + "s. Something's wrong");
  }

  /**
   * Async try and sign deploy using the wallet
   * 
   * @param wallet wallet for signing
   * @param contactHash hex encoded hash of the contract with or without the 'hash-' prefix
   * @param entry name of the entry point
   * @param args arguments for this contract call
   * @param gas how much gas to use for this call
   * 
   * @returns Deploy a array of deploy hash string and deploy result
   */  
  async signAndDeployContractCall(
    wallet: Wallet,
    contractHash: string,
    entryPoint: string,
    args: RuntimeArgs, 
    gas: BigNumber, 
  ): Promise<[string, GetDeployResult]> {
    try {
      // Convert contract hash to bytes
      const contractHashAsByteArray = Uint8Array.from(
        Buffer.from(contractHash, 'hex')
      )
      
      // Create the deploy item using contractHash + entryPoint + args
      const deployItem = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        contractHashAsByteArray,
        entryPoint,
        args,
      )

      // Convert the signed deploy json to a deploy
      const signedDeploy = await this.makeAndSignDeploy(wallet, deployItem, gas)

      // Put and confirm deploy
      return this.putAndConfirmDeploy(wallet, signedDeploy)
    } catch (err) {
      log.error(`Casper Client - signAndDeployContractCall error: ${err}`)
      
      // rethrow error
      throw err
    }
  }

  /**
   * Async try and sign deploy using the wallet
   * 
   * @param wallet wallet for signing
   * @param wasm hex encoded hash of the contract with or without the 'hash-' prefix
   * @param args arguments for this contract call
   * @param gas how much gas to use for this call
   * 
   * @returns Deploy a array of deploy hash string and deploy result
   */  
  async signAndDeployWasm(
    wallet: Wallet,
    wasm: ArrayBuffer,
    args: RuntimeArgs,
    gas: BigNumber, 
  ): Promise<[string, GetDeployResult]> {
    try {
      // Create the deploy item using wasm + args
      const deployItem = DeployUtil.ExecutableDeployItem.newModuleBytes(
        new Uint8Array(wasm),
        args,
      )

      console.log("deployItem", deployItem)
      // Convert the signed deploy json to a deploy

      const signedDeploy = await this.makeAndSignDeploy(wallet, deployItem, gas)
      console.log("signedDeploy", signedDeploy)
      // Put and confirm deploy
      return this.putAndConfirmDeploy(wallet, signedDeploy)
    } catch (err) {
      log.error(`Casper Client - signAndDeployWasm error: ${err}`)
      
      // rethrow error
      throw err
    }
  }

  /**
   * Create and sign the deploy
   * 
   * @param wallet wallet for signing
   * @param deployItem item to deploy
   * @param gas how much gas to use for this call
   * 
   * @returns a signed deploy 
   */
  async makeAndSignDeploy(wallet: Wallet, deployItem: DeployUtil.ExecutableDeployItem, gas: BigNumber): Promise<DeployUtil.Deploy> {
    try {
      // Create the Deploy using wasm + args
      const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(wallet.publicKey as CLPublicKey, this._network),
        deployItem,
        DeployUtil.standardPayment(gas.toNumber())
      )

      return await wallet.sign(deploy)
    } catch (err) {
      log.error(`Casper Client - putAndConfirmDeploy error: ${err}`)
      
      // rethrow error
      throw err
    }
  }

  /**
   * Execute putDeploy and getDeploy to confirm a successfully deploy
   * 
   * @param wallet wallet to deploy using
   * @param signedDeploy deploy to putDeploy
   * 
   * @returns the array with the deployHash and detailed deploy information
   */
  async putAndConfirmDeploy(wallet: Wallet, signedDeploy: DeployUtil.Deploy): Promise<[string, GetDeployResult]> {
    try {
      const deployHash = await wallet.deploy(signedDeploy)

      console.log('deployHash', deployHash)

      const [_, deployResult] = await this.getDeploy(deployHash)
      
      return [deployHash, deployResult]
    } catch (err) {
      log.error(`Casper Client - putAndConfirmDeploy error: ${err}`)
      
      // rethrow error
      throw err
    }
  }
}