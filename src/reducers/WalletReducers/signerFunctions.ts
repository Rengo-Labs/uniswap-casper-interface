import { CasperServiceByJsonRPC } from "casper-js-sdk";

export async function signerLogIn(signer) {
    await signer.sendConnectionRequest();
    return await signer.getActivePublicKey();
}

export async function signerLogOut(signer) {
    await signer.disconnectFromSite();
}

export const NODE_ADDRESS = 'https://casperlabs-proxy-server.herokuapp.com/http://159.65.118.250:7777/rpc'

export function clientDispatcher() {
    return new CasperServiceByJsonRPC(NODE_ADDRESS);
}