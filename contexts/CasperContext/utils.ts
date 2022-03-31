
import { Signer } from 'casper-js-sdk';

export async function checkConnection() {
    try {
        return await Signer.isConnected();
    }
    catch (err){
        return err
    }
}
export async function getActiveKeyFromSigner() {
    try {
        return await Signer.getActivePublicKey();
    }
    catch (err){
        return err
    }

}
export async function connectToSigner() {

    try {
        return await Signer.sendConnectionRequest();
    }
    catch (err){
        return err
    }
}