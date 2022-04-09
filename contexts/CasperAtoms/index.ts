import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'

import { disconnectFromSite, isConnected, getActivePublicKey } from '@commons/controllers/casperController'


export const isConnectedAtom = atomWithStorage<Boolean>("isConnected", false)
export const activePublicKeyAtom = atomWithStorage<string | Boolean>("getActivePublicKey", false)


export const disconnectFromSiteAtom = atom(() => { }, async (get, set, { Signer }) => {
    await disconnectFromSite(Signer)
    set(isConnectedAtom, false)
})

export const checkConnectionAtom = atom(() => { }, async (get, set, { Signer }) => {
    const res = await isConnected(Signer)
    set(isConnectedAtom, res)
})

export const connectAtom = atom(() => { }, async (get, set, { Signer }) => {
    const publicKey = await getActivePublicKey(Signer)
    if (!publicKey) {
        set(isConnectedAtom, false)
        set(activePublicKeyAtom, false)
    }
    set(isConnectedAtom, true)
    set(activePublicKeyAtom, publicKey)
})