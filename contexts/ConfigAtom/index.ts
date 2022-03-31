import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'


export const showConfig = atomWithStorage<Boolean>("config",false)
export const setConfig = atom(
    (get) => get(showConfig),
    (get, set) => set(showConfig, !get(showConfig)))