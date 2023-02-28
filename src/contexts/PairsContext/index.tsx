import {ReactNode, useState, createContext, useReducer, useEffect, useContext} from "react";
import {initialPairsState, PairData, PairsReducer} from "../../reducers/PairsReducer";
import PairsResponsibilities, {PairTotalReserves} from "../../commons/PairsResponsibilities";
import {Wallet} from "../../commons";
import {PairReserves} from "../ConfigContext";
import {notificationStore} from "../../store/store";

interface PairsContextProps {
    children: ReactNode
}

interface PairsContext {
    pairState: Record<string, PairData>,
    pairDispatch,
    loadPairs: (tokenState) => Promise<Record<string, PairTotalReserves>>
    loadPairsUSD: (pairsTotalReserves: Record<string, PairTotalReserves>) => Promise<void>,
    loadUserPairsData: (wallet: Wallet, isConnected) => Promise<void>,
    orderedPairState,
    clearUserPairsData: (pairState) => Promise<void>,
    findReservesBySymbols?: (tokenASymbol: string, tokenBSymbol: string) => PairReserves | undefined;
    getPoolList: (pairState: Record<string, PairData>) => any[],
    changeRowPriority: (name: string, checked: boolean) => void
}

export const PairsContextProvider = createContext<PairsContext>({} as any)

export const PairsContext = ({children}: PairsContextProps) => {
    const { updateNotification } = notificationStore();
    const [pairState, pairDispatch] = useReducer(
        PairsReducer,
        initialPairsState
    );

    const orderedPairState: Record<string, PairTotalReserves> = PairsResponsibilities(pairState, pairDispatch).orderedPairState()


    const loadPairs = async (tokenState): Promise<Record<string, PairTotalReserves>> => {
       return await PairsResponsibilities(pairState, pairDispatch, tokenState).loadPairs()
    }

    const loadPairsUSD = async (pairsTotalReserves) => {
        await PairsResponsibilities(pairState, pairDispatch).loadPairsBalanceUSD(pairsTotalReserves, updateNotification)
    }

    const loadUserPairsData = async (wallet: Wallet, isConnected) => {
        await PairsResponsibilities(pairState, pairDispatch).loadPairsUserData(wallet, isConnected)
    }

    const clearUserPairsData = async (pairState) => {
        await PairsResponsibilities(pairState, pairDispatch).clearUserPairsData()
    }

    const findReservesBySymbols = (symbolA, symbolB) => PairsResponsibilities(pairState, pairDispatch)
      .findReservesBySymbols(symbolA, symbolB, orderedPairState, updateNotification)

    const getPoolList = (pairState) => PairsResponsibilities(pairState, pairDispatch).getList(pairState)

    const changeRowPriority = (name, checked) => PairsResponsibilities(pairState, pairDispatch).changeRowPriority(name, checked)

    return (
        <PairsContextProvider.Provider value={{
            pairState,
            pairDispatch,
            loadPairs,
            loadPairsUSD,
            loadUserPairsData,
            orderedPairState,
            clearUserPairsData,
            findReservesBySymbols,
            getPoolList,
            changeRowPriority
        }}>
            {children}
        </PairsContextProvider.Provider>
    )

}

