import {ReactNode, useState, createContext, useReducer, useEffect, useContext} from "react";
import {initialPairsState, PairData, PairsReducer} from "../../reducers/PairsReducer";
import PairsResponsibilities, {PairTotalReserves} from "../../commons/PairsResponsibilities";
import {Wallet} from "../../commons";
import {PairReserves} from "../ConfigContext";
import {notificationStore} from "../../store/store";
import {TokensProviderContext} from "../TokensContext";

interface PairsContextProps {
    children: ReactNode
}

interface PairsContext {
    pairState: Record<string, PairData>,
    pairDispatch,
    loadPairs: (tokenState) => Promise<Record<string, PairTotalReserves>>
    loadPairsUSD: (pairsTotalReserves: Record<string, PairTotalReserves>, tokenState) => Promise<void>,
    loadUserPairsData: (wallet: Wallet, isConnected) => Promise<void>,
    orderedPairState,
    clearUserPairsData: (pairState) => Promise<void>,
    findReservesBySymbols?: (tokenASymbol: string, tokenBSymbol: string, tokenState) => PairReserves | undefined;
    getPoolList: () => any[],
    changeRowPriority: (name: string, checked: boolean) => void,
    calculateUSDtokens: (t0: string, t1: string, amount0: string | number, amount1: string | number, isAorB: boolean) => string[];
    findUSDPairBySymbols: (t0: string, t1: string, amount0: string | number, amount1: string | number, tokenState) => string[];
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

    const loadPairsUSD = async (pairsTotalReserves, tokenState) => {
        await PairsResponsibilities(pairState, pairDispatch, tokenState).loadPairsBalanceUSD(pairsTotalReserves, updateNotification)
    }

    const loadUserPairsData = async (wallet: Wallet, isConnected) => {
        await PairsResponsibilities(pairState, pairDispatch).loadPairsUserData(wallet, isConnected)
    }

    const clearUserPairsData = async (pairState) => {
        await PairsResponsibilities(pairState, pairDispatch).clearUserPairsData()
    }

    const findReservesBySymbols = (symbolA, symbolB, tokenState) => PairsResponsibilities(pairState, pairDispatch, tokenState)
      .findReservesBySymbols(symbolA, symbolB, orderedPairState, updateNotification)

    const getPoolList = () => PairsResponsibilities(pairState, pairDispatch).getList()

    const changeRowPriority = (name, checked) => PairsResponsibilities(pairState, pairDispatch).changeRowPriority(name, checked)

    const calculateUSDtokens = (token0, token1, amount0, amount1, isAorB) => PairsResponsibilities(pairState, pairDispatch).calculateUSDtokens(token0, token1, amount0, amount1, isAorB)

    const findUSDPairBySymbols = (token0, token1, amount0, amount1, tokenState) => {
      const priceA = PairsResponsibilities(pairState, pairDispatch, tokenState).findUSDRateBySymbol(token0, updateNotification)
      const priceB = PairsResponsibilities(pairState, pairDispatch, tokenState).findUSDRateBySymbol(token1, updateNotification)
      return [priceA.toString(), priceB.toString()]
    }

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
            changeRowPriority,
            calculateUSDtokens,
            findUSDPairBySymbols
        }}>
            {children}
        </PairsContextProvider.Provider>
    )

}

