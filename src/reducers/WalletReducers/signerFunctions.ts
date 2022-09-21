import { CasperServiceByJsonRPC,Signer} from "casper-js-sdk";
import { NODE_ADDRESS } from "../../constant";

export async function signerLogIn(signer) {
  try {
    await Signer.sendConnectionRequest();
  } catch (error) {
    console.log("sendConnectionRequest", error);
  }
}
export async function getActivePublicKey(signer) {
  try {
    return await signer.getActivePublicKey();
  } catch (error) {
    console.log("getActivePublicKey", error);
  }
}

export async function signerLogOut(signer) {
  await signer.disconnectFromSite();
}

export function clientDispatcher() {
  return new CasperServiceByJsonRPC(NODE_ADDRESS);
}
