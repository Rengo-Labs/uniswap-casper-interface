import * as pairProd from '../constant/pairHashes.production'
import * as pairDev from '../constant/pairHashes.development'
import * as pairInt from '../constant/pairHashes.integration'

import * as tokenProd from '../constant/tokenHashes.production'
import * as tokenDev from '../constant/tokenHashes.development'
import * as tokenInt from '../constant/tokenHashes.integration'
import {Token} from "../commons/api/types";
import {Network} from "../commons/wallet/types";
import {PairState} from "../reducers/PairsReducer";

let pairData: PairState
let tokenData: Record<string, Token>
let firstInitialToken
let secondInitialToken
let CSPRPackageHash
let networkName: Network
let USDT_SYMBOL: string
let USDC_SYMBOL: string
let casperNode: string

switch (process.env.REACT_APP_NETWORK_KEY) {
  case 'casper-testing':
    pairData = pairDev.pairList
    tokenData = tokenDev.tokenList
    firstInitialToken = 'CSPR'
    secondInitialToken = 'WETH'
    CSPRPackageHash = 'hash-0885c63f5f25ec5b6f3b57338fae5849aea5f1a2c96fc61411f2bfc5e432de5a'
    networkName = Network.CASPER_TESTNET
    USDT_SYMBOL = 'USDT'
    USDC_SYMBOL = 'USDC'
    casperNode = 'https://casper-node-proxy.dev.make.services/'
    break
  case 'integration-test':
    pairData = pairInt.pairList
    tokenData = tokenInt.tokenList
    firstInitialToken = 'CSPR'
    secondInitialToken = 'dETH'
    CSPRPackageHash = 'hash-6b7453749234eb23f6e81aa2fe01b3a8f4bafb94247942a6ac0d77e952978afa'
    networkName = Network.CASPER_INTEGRATION
    USDT_SYMBOL = 'dUSDT'
    USDC_SYMBOL = 'dUSDC'
    casperNode = 'https://casper-node-proxy.dev-integration.make.services/'
    break
  case 'casper':
    pairData = pairProd.pairList
    tokenData = tokenProd.tokenList
    firstInitialToken = 'CSPR'
    secondInitialToken = 'dETH'
    CSPRPackageHash = 'hash-c6649901da894d4ac2c77c0ae217190f79cabc8c0c91788ee997f670b8bdd05e'
    networkName = Network.CASPER_MAINNET
    USDT_SYMBOL = 'dUSDT'
    USDC_SYMBOL = 'dUSDC'
    casperNode = 'https://casper-node-proxy.make.services/'
    break
  default:
    pairData = pairDev.pairList
    tokenData = tokenDev.tokenList
    firstInitialToken = 'CSPR'
    secondInitialToken = 'WETH'
    CSPRPackageHash = 'hash-0885c63f5f25ec5b6f3b57338fae5849aea5f1a2c96fc61411f2bfc5e432de5a'
    networkName = Network.CASPER_TESTNET
    USDT_SYMBOL = 'USDT'
    USDC_SYMBOL = 'USDC'
    casperNode = 'https://casper-node-proxy.dev.make.services/'
}

export {
  pairData,
  tokenData,
  firstInitialToken,
  secondInitialToken,
  CSPRPackageHash,
  networkName,
  USDT_SYMBOL,
  USDC_SYMBOL,
  casperNode
}