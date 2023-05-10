import React from "react";

import {BlockchainAPI} from '../api/APIBlockchain'
import {Wallet} from "../wallet"

const client = new BlockchainAPI()

const BlockchainResponsibilities = (wallet: Wallet) => {

    const getInfoByTopic = async () => {
        return client.getInfoByTopic(wallet.publicKeyHex, 1, 25)
    }

    const getAccountInfo = async () => {
        return client.getAccountInfo(wallet.publicKeyHex)
    }

    return {
        getInfoByTopic,
        getAccountInfo
    }

}

export default BlockchainResponsibilities
