import { atomWithStorage } from 'jotai/utils'

export const publicAddressAtom = atomWithStorage<string>("publicAddressAtom", "")
