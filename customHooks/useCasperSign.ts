import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'

import { Signer } from 'casper-js-sdk';

export const signerUnlockedAtom = atomWithStorage<Boolean>("signerUnlockedAtom", false)
export const signerConnectedAtom = atomWithStorage<Boolean>("signerConnectedAtom", false)
export const activePublicKeyAtom = atomWithStorage<string | Boolean>("getActivePublicKey", false)

export function useCasper() {

    const [signerUnlocked, signerUnlockedSetter] = useAtom(signerUnlockedAtom)
    const [signerConnected, signerConnectedSetter] = useAtom(signerConnectedAtom)
    const [activePublicKey, activePublicKeySetter] = useAtom(activePublicKeyAtom)

    async function connectToSigner() {
        try {
            if (signerUnlocked) {
                console.log("wallet unlocked")
                await Signer.sendConnectionRequest()
                const publicKey = await Signer.getActivePublicKey().catch(err => { console.log(err) })
                activePublicKeySetter(typeof publicKey === "string" ? publicKey : false)
                signerUnlockedSetter(true)

            }
            else {
                console.log("wallet locked")
                await Signer.sendConnectionRequest()
                signerUnlockedSetter(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function disconnectToSigner() {
        try {
            if (signerConnected && signerUnlocked) {
                await Signer.disconnectFromSite();
                signerConnectedSetter(false)
                signerUnlockedSetter(false)
            }
            else {
                await Signer.sendConnectionRequest()
                await Signer.disconnectFromSite();
                signerConnectedSetter(false)
                signerUnlockedSetter(false)
            }

        }
        catch (err) {
            console.log(err)
        }

    }

    async function checkConnection() {
        try {
            return await Signer.isConnected()
        } catch (error) {
            return false
        }
    }

    return {
        signerUnlocked,
        signerUnlockedSetter,
        signerConnected,
        signerConnectedSetter,
        activePublicKey,
        activePublicKeySetter,
        connectToSigner,
        disconnectToSigner,
        checkConnection
    }
}