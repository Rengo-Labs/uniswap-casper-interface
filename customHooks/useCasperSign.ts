import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'

import { Signer } from 'casper-js-sdk';

export const signerLockedAtom = atomWithStorage<Boolean>("signerLockedAtom", false)
export const signerConnectedAtom = atomWithStorage<Boolean>("signerConnectedAtom", false)
export const activePublicKeyAtom = atomWithStorage<string | Boolean>("getActivePublicKey", false)

export function useCasper() {

    const [signerLocked, signerLockedSetter] = useAtom(signerLockedAtom)
    const [signerConnected, signerConnectedSetter] = useAtom(signerConnectedAtom)
    const [activePublicKey, activePublicKeySetter] = useAtom(activePublicKeyAtom)
  

    async function getActiveKeyFromSigner() {
        try {
            activePublicKeySetter(await Signer.getActivePublicKey())
        }
        catch {
            let variant: any = "error";
        }
    }

    async function checkConnection() {
        try {
            const isConnected = await Signer.isConnected()
            signerConnectedSetter(isConnected)
            return isConnected;
        }
        catch {
            let variant: any = "error";
        }
    }
    async function connectToSigner() {
        try {
            await Signer.sendConnectionRequest();
        }
        catch {
            let variant: any = "error";
        }
    }

    async function disconnectToSigner() {
        try {
            await Signer.disconnectFromSite();
        }
        catch {
            let variant: any = "error";
        }
    }

    return {
        signerLocked,
        signerLockedSetter,
        signerConnected,
        signerConnectedSetter,
        activePublicKey,
        activePublicKeySetter,
        getActiveKeyFromSigner,
        checkConnection,
        connectToSigner,
        disconnectToSigner
    }
}