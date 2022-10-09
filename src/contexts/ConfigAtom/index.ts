import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'


export const showConfig = atomWithStorage<boolean>("config", false)
export const setConfig = atom(
    (get) => get(showConfig),
    (get, set) => set(showConfig, !get(showConfig))
)

type WalletType = "casper" | "torus" | null

export const walletAtom = atomWithStorage<WalletType>("WalletSelected", null)


