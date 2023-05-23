import React from "react";

import {BlockchainAPI} from '../api/APIBlockchain'
import {Wallet} from "../wallet"
import { TokenState } from "../../reducers/TokenReducers";

const client = new BlockchainAPI()

const BlockchainResponsibilities = (wallet: Wallet, tokenState?: TokenState) => {

    const getInfoByTopic = async () => {
      return client.getInfoByTopic(wallet.publicKeyHex, 1, 25)
    }

    const getAccountInfo = async () => {
      return client.getAccountInfo(wallet, tokenState)
    }

    const getTransfers = async () => {
      return client.getTransfers(wallet.accountHashString.slice(13), 1, 25, 1, 1)
    }

    return {
        getInfoByTopic,
        getAccountInfo,
        getTransfers
    }

}

export default BlockchainResponsibilities
