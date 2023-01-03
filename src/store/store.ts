import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { IGlobalStore } from './types'


export const globalStore = create(
  devtools<IGlobalStore>((set) => ({
    slippageTolerance: 0.5,
    updateSlippageTolerance: (slippageToleranceValue) =>
      set((state: IGlobalStore) => ({
        ...state,
        slippageTolerance: slippageToleranceValue,
      })),
  })),
);
