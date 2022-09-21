import Torus from "@toruslabs/casper-embed";
import { CasperServiceByJsonRPC } from "casper-js-sdk";

const CHAINS = {
    CASPER_MAINNET: "casper",
    CASPER_TESTNET: "casper-test",
};

const SUPPORTED_NETWORKS = {
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


const onChainChange = (torus: any) => {
    torus.provider.on('chainChanged', (resp: any) => {
        console.log(resp, 'chainchanged');
        //setChainId(parseInt(resp.toString(), 10))
    });
}

const onAccountsChanged = (torus: any) => {
    torus.provider.on('accountsChanged', (accounts: any) => {
        console.log(accounts, 'accountsChanged');
        //setPublicAddress((Array.isArray(accounts) && accounts[0]) || '');
    });
}

export async function torusLogout(torus) {
    await torus?.logout();
}

export async function torusLogin() {
    try {
        const torus = new Torus();
        await torus.init({
            buildEnv: "testing",
            showTorusButton: true,
            network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
        });
        const loginaccs = await torus?.login();
        const userInfo = await torus.getUserInfo();
        onChainChange(torus);
        onAccountsChanged(torus);
        return {torus:torus, walletAddress:loginaccs[0], profileImage:userInfo.profileImage}
    } catch (error) {
        const torus = new Torus();
        await torus?.clearInit();
        console.error(error);
    }
};

export const getStateRootHash = async (client) => {
    const { block } = await client.getLatestBlockInfo();
    if (block) {
        return block.header.state_root_hash;
    } else {
        throw Error("Problem when calling getLatestBlockInfo");
    }
};