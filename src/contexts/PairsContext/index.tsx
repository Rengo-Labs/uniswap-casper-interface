import {ReactNode, useState, createContext, useReducer, useEffect, useContext} from "react";
import {initialPairsState, PairsReducer} from "../../reducers/PairsReducer";
import PairsResponsibilities, {PairTotalReserves} from "../../commons/PairsResponsibilities";
import {Wallet} from "../../commons";

interface PairsContextProps {
    children: ReactNode
}

interface PairsContext {
    pairState: any,
    loadPairs: (tokenState) => Promise<Record<string, PairTotalReserves>>
    loadPairsUSD: (pairsTotalReserves: Record<string, PairTotalReserves>) => Promise<void>,
    loadUserPairsData: (wallet: Wallet, isConnected) => Promise<void>,
    orderedPairState,
    clearUserPairsData: (pairState) => Promise<void>
}

export const PairsContextProvider = createContext<PairsContext>({} as any)


export const PairsContext = ({children} : PairsContextProps) => {
    const [pairState, pairDispatch] = useReducer(
        PairsReducer,
        initialPairsState
    );

    const orderedPairState: Record<string, PairTotalReserves> = PairsResponsibilities(pairState, pairDispatch).orderedPairState()


    const loadPairs = async (tokenState): Promise<Record<string, PairTotalReserves>> => {
       return await PairsResponsibilities(pairState, pairDispatch, tokenState).loadPairs()
    }

    const loadPairsUSD = async (pairsTotalReserves) => {
        await PairsResponsibilities(pairState, pairDispatch).loadPairsBalanceUSD(pairsTotalReserves)
    }

    const loadUserPairsData = async (wallet: Wallet, isConnected) => {
        await PairsResponsibilities(pairState, pairDispatch).loadPairsUserData(wallet, isConnected)
    }

    const clearUserPairsData = async (pairState) => {
        await PairsResponsibilities(pairState, pairDispatch).clearUserPairsData()
    }

    return (
        <PairsContextProvider.Provider value={{
            pairState,
            loadPairs,
            loadPairsUSD,
            loadUserPairsData,
            orderedPairState,
            clearUserPairsData
        }}>
            {children}
        </PairsContextProvider.Provider>
    )

}

