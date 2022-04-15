import Torus, { TORUS_BUILD_ENV_TYPE, TorusInPageProvider } from "@toruslabs/casper-embed";
import { Connection } from "@solana/web3.js";

import Web3 from 'web3';
import { AbstractProvider } from 'web3-core';


// import { encrypt, recoverTypedMessage } from "eth-sig-util";
// import { keccak256 } from 'ethers/lib/utils';
// import { ethers } from "ethers";
// import { getV3TypedData, getV4TypedData, whiteLabelData } from "../data";
// import tokenAbi from "human-standard-token-abi";

type Web3Object = {
  web3: Web3;
  torus: Torus | null;
  setweb3: (provider: TorusInPageProvider) => void;
};

export const web3Obj: Web3Object = {
  web3: new Web3(),
  torus: null,
  setweb3(provider): void {
    web3Obj.web3.setProvider(provider as AbstractProvider);
  },
};

let torus: Torus | null;

export const CHAINS = {
  CASPER_MAINNET: "casper",
  CASPER_TESTNET: "casper-test",
};

export const SUPPORTED_NETWORKS = {
  [CHAINS.CASPER_MAINNET]: {
    blockExplorerUrl: "https://cspr.live",
    chainId: "0x1",
    displayName: "Casper Mainnet",
    logo: "https://cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: CHAINS.CASPER_MAINNET,
  },
  [CHAINS.CASPER_TESTNET]: {
    blockExplorerUrl: "https://testnet.cspr.live",
    chainId: "0x2",
    displayName: "Casper Testnet",
    logo: "https://testnet.cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://testnet.casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: CHAINS.CASPER_TESTNET,
  },
};

export const torusLogin = async () => {
  try {
    torus = new Torus();
    console.log("torus", torus);
    await torus.init({
      buildEnv: "testing",
      showTorusButton: true,
      network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
    });
    const loginaccs = await torus?.login();
    const setActivePublicKey = (loginaccs || [])[0];
  } catch (error) {
    console.error(error);
    await torus?.clearInit();
  }
};

export const onChainChange = (torus) => {
  torus.provider.on('chainChanged', (resp) => {
    console.log(resp, 'chainchanged');
    //setChainId(parseInt(resp.toString(), 10))
  });
}

export const onAccountsChanged = (torus) => {
  torus.provider.on('accountsChanged', (accounts) => {
    console.log(accounts, 'accountsChanged');
    //setPublicAddress((Array.isArray(accounts) && accounts[0]) || '');
  });
}