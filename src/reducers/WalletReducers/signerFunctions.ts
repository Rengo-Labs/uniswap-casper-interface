import { CasperServiceByJsonRPC } from "casper-js-sdk";
import { NODE_ADDRESS } from "../../constant";

export async function signerLogIn(signer) {
    await signer.sendConnectionRequest();
    return await signer.getActivePublicKey();
}

export async function signerLogOut(signer) {
    await signer.disconnectFromSite();
}

export function clientDispatcher() {
    return new CasperServiceByJsonRPC(NODE_ADDRESS);
}