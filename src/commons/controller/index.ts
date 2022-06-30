import Torus from "@toruslabs/casper-embed";
import { Signer } from "casper-js-sdk";
import { CHAINS, SUPPORTED_NETWORKS } from "../../constant";

export enum ActiveWallet {
  CASPER = "casper",
  TORUS = "torus",
}

export class WalletController {
  activeWallet: ActiveWallet = ActiveWallet.CASPER;
  torus;
  walletAddress;
  constructor() {}
  switchWallet() {
    console.log("switchWallet",this.activeWallet)
    if (this.activeWallet === ActiveWallet.CASPER) {
      this.activeWallet = ActiveWallet.TORUS;
    } else {
      this.activeWallet = ActiveWallet.CASPER;
    }
  }
  async connect(){
    if (this.activeWallet === ActiveWallet.CASPER) {
      return connectSigner().then((walletAddress) => {
        this.walletAddress = walletAddress;
        return this.walletAddress;
      });
    } else {
      return connectTorus(this.torus)
      .then((walletAddress) => {
        this.walletAddress = walletAddress[0];
        return this.walletAddress;
      });
    }
  }
  async disconnect() {
    try {
      if (this.activeWallet === ActiveWallet.CASPER) {
        this.activeWallet = ActiveWallet.TORUS;
      } else {
        await disconnectTorus(this.torus)
      }
    } catch (error) {
      
    }
  }
}

function connectSigner() {
  return Signer.getActivePublicKey()
    .then((walletAddress) => {
      return walletAddress;
    })
    .catch((err) => {
      Signer.sendConnectionRequest();
    });
}

async function connectTorus(torus) {
  torus = new Torus();
  await torus.init({
    buildEnv: "testing",
    showTorusButton: true,
    network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  });
  return await torus?.login();
}

async function disconnectTorus(torus) {
  await torus?.clearInit();
}
