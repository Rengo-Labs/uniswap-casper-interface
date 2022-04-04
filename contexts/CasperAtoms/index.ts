import {
    Signer
} from 'casper-js-sdk';
import { atomWithStorage } from 'jotai/utils'
import { atom, useAtom } from 'jotai'

export const signerConnected = atomWithStorage<Boolean>("signerConnected", false)
export const walletSignerConnected = atomWithStorage<Boolean>("walletSignerConnected", false)
export const AddressAtom = atomWithStorage<String>("Address", null)
export const signerLocked = atomWithStorage<Boolean>("signerLocked", false)
// if (signerConnectedAtom) {
//     let res = getActiveKeyFromSigner()
//     localStorage.setItem("Address", res)
//     props.setActivePublicKey(res)
// }

export const getActiveKeyFromSigner = atom(() => { }, async (get, set) => {
    try {
        const address = await Signer.getActivePublicKey()
        set(AddressAtom, address)
    }
    catch {
        set(AddressAtom, null)
    }
})

export const checkConnection = atom(() => { }, async (get, set) => {
    try {
        const connection = await Signer.isConnected()
        set(signerConnected, connection)
    }
    catch {
        set(signerConnected, false)
    }
})

export async function connectToSigner() {
    try {
        return await Signer.sendConnectionRequest();
    }
    catch {
    }
}

export const setSignerLocked = atom(() => { }, async (get, set, { isUnlocked }) => {
    set(signerLocked, !isUnlocked)
})
export const setSignerConnected = atom(() => { }, async (get, set, { connected }) => {
    set(signerConnected, connected)
})
export const AddressAtomSetter = atom((get) => { }, (get, set, { activeKey }) => {
    set(AddressAtom, activeKey)
})

const [, setSignerLockedSetter] = useAtom(setSignerLocked)
const [, setSignerConnectedSetter] = useAtom(setSignerConnected)
const [, AddressAtomSetterSetter] = useAtom(AddressAtomSetter)

window.addEventListener('signer:connected', (msg: any) => {
    setSignerLockedSetter(!msg.detail.isUnlocked)
    setSignerConnectedSetter(true)
    AddressAtomSetterSetter(msg.detail.activeKey)
});

window.addEventListener('signer:disconnected', (msg: any) => {
    setSignerLockedSetter(!msg.detail.isUnlocked)
    setSignerConnectedSetter(false)
    AddressAtomSetterSetter(msg.detail.activeKey)
});

window.addEventListener('signer:tabUpdated', (msg: any) => {
    setSignerLockedSetter(!msg.detail.isUnlocked)
    setSignerConnectedSetter(msg.detail.isConnected)
    AddressAtomSetterSetter(msg.detail.activeKey)
});

window.addEventListener('signer:activeKeyChanged', (msg: any) => {
    AddressAtomSetterSetter(msg.detail.activeKey)
});

window.addEventListener('signer:locked', (msg: any) => {
    setSignerLockedSetter(!msg.detail.isUnlocked);
    AddressAtomSetterSetter(msg.detail.activeKey)
});

window.addEventListener('signer:unlocked', (msg: any) => {
    setSignerLockedSetter(!msg.detail.isUnlocked)
    setSignerConnectedSetter(msg.detail.isConnected)
    AddressAtomSetterSetter(msg.detail.activeKey)
});

window.addEventListener('signer:initialState', (msg: any) => {
    setSignerLockedSetter(!msg.detail.isUnlocked)
    setSignerConnectedSetter(msg.detail.isConnected)
    AddressAtomSetterSetter(msg.detail.activeKey)
});