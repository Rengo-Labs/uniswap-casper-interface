import axios from 'axios'

import { API_BLOCKCHAIN_INFO } from '../../constant';

export const enum BlockchainAPIQuery {
  TRANSACTION = 'extended-deploys',
  ACCOUNT = 'accounts',
  INFO_STATUS = 'rpc/info_get_status',
  TOTAL_REWARDS = 'delegators'
}

export interface BlockchainInfo {
  deployHash: string,
  blockHash: string,
  publicKey: string,
  packageHash: string,
  cost: any,
  payment: any,
  timestamp: any,
  status: string,
  amount: any
}

export interface AccountInfo {
  publicKey: string,
  accountHash: string,
  totalRewardReceived: any,
  totalBalance: any,
  liquid: any,
  stakedAsDelegator: any,
  undelegating: any
}

/**
 * Client for working with Blockchain API
 */
export class BlockchainAPI {

  constructor() {}

  async getInfoByTopic(publicKey: string, page: string | number, limit: string | number, sortFields= "entry_point,contract_package", contractPackageHash = ''): Promise<BlockchainInfo[]> {

    let path = `${API_BLOCKCHAIN_INFO}/${BlockchainAPIQuery.TRANSACTION}?page=${page}&limit=${limit}&fields=${sortFields}&caller_public_key=${publicKey}`

    if (contractPackageHash && contractPackageHash !== '') {
      path = path + `&contract_package_hash=${contractPackageHash}`
    }
    const res = await axios.get(path)

    

    if (res.data.data.length > 0) {
      return res.data.data.map(item => ({
        "deployHash": item.deploy_hash,
        "blockHash": item.block_hash,
        "publicKey": item.caller_public_key,
        "packageHash": item.contract_package,
        "cost": item.cost,
        "payment": item.payment_amount,
        "timestamp": item.timestamp,
        "status": item.status,
        "amount": item.args?.amount?.parsed
      })) as BlockchainInfo[]
    }

    return []
  }

  /**
   * get account info
   */
  getAccountInfo = async (publicKey: string): Promise<AccountInfo> => {

    //const res = axios.get(`${API_BLOCKCHAIN_INFO}/${BlockchainAPIQuery.ACCOUNT}`)

    const infoStatus = await this.getInfoStatus()
    const totalRewards = await this.getTotalRewards(publicKey)
    const undelegating = await this.getUndelegation(publicKey, infoStatus)

    return {
      publicKey: publicKey,
      accountHash: "hash",
      totalRewardReceived: totalRewards,
      totalBalance: 0.00000000,
      liquid: 0.00000000,
      stakedAsDelegator: 0.00000000,
      undelegating: undelegating
    } as AccountInfo
  }

  getInfoStatus = async () => {
    const res = await axios.get(`${API_BLOCKCHAIN_INFO}/${BlockchainAPIQuery.INFO_STATUS}`)
    if (res.data) {
      return res.data.result["last_added_block_info"]['era_id']
    }

    return "0"
  }

  getTotalRewards = async (publicKey: string) => {
    const res = await axios.get(`${API_BLOCKCHAIN_INFO}/${BlockchainAPIQuery.TOTAL_REWARDS}/${publicKey}/total-rewards`)
    if (res.data) {
      return res.data.data
    }

    return "0"
  }

  getUndelegation = async (publicKey: string, infoStatus: string) => {
    const res = await axios.get(`${API_BLOCKCHAIN_INFO}/${BlockchainAPIQuery.ACCOUNT}/${publicKey}/tokens-in-undelegation/${infoStatus}`)
    if (res.data) {
      return res.data.data
    }

    return "0"
  }

  // blockchain status
  // https://event-store-api-clarity-testnet.make.services/rpc/info_get_status

  // https://event-store-api-clarity-testnet.make.services/rpc/state_get_item?state_root_hash=58abd2cdd76db483f0b3dc5d82e15eeb3d31473b0271effe3bb1a30e082bf6e0&key=account-hash-6bc21d981ab85c81b765879b74c70832551e1c2b83f149f6e8ac7fc54a74df40

  // total REWARDS
  // https://event-store-api-clarity-testnet.make.services/delegators/015f15ac785e0d519819c5fb7d311d4518ba52b717b826ba25f9876d21aad44451/total-rewards

  // Total Balance - TODO get from the wallet connection
  // Request URL:
  // https://event-store-api-clarity-testnet.make.services/rpc/state_get_balance?state_root_hash=3a653596e4e9a109f3f01818e74b168f927a3a71d93bae4448f710e2079a9c22&purse_uref=uref-ca56a17805a70084ddcb7eb474b4f8805d05e2edffbe8adb7e4e65f92fbe19fb-007

  // Token in Undelegating
  // https://event-store-api-clarity-testnet.make.services/accounts/015f15ac785e0d519819c5fb7d311d4518ba52b717b826ba25f9876d21aad44451/tokens-in-undelegation/9076
  // MORE INFORMATION FASTER
  // https://event-store-api-clarity-testnet.make.services/accounts/6bc21d981ab85c81b765879b74c70832551e1c2b83f149f6e8ac7fc54a74df40/erc20-tokens
}
