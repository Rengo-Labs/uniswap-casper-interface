import {ReactNode, createContext, useReducer} from "react";
import {initialPairsState, PairActions, PairData, PairsReducer} from "../../reducers/PairsReducer";
import PairsResponsibilities, {PairTotalReserves} from "../../commons/PairsResponsibilities";
import {Wallet} from "../../commons";
import {PairReserves} from "../ConfigContext";
import {notificationStore} from "../../store/store";
import {TokenState} from "../../reducers/TokenReducers";

interface PairsContextProps {
    children: ReactNode
}

interface PairsContext {
    pairState: Record<string, PairData>,
    pairDispatch,
    loadPairs: (tokenState) => Promise<Record<string, PairTotalReserves>>
    loadPairsUSD: (pairsTotalReserves: Record<string, PairTotalReserves>, tokenState) => Promise<void>,
    loadUserPairsData: (wallet: Wallet, isConnected, tokenState: TokenState) => Promise<any>,
    orderedPairState,
    clearUserPairsData: (pairState, tokenState: TokenState) => Promise<void>,
    findReservesBySymbols?: (tokenASymbol: string, tokenBSymbol: string, tokenState) => PairReserves | undefined;
    getPoolList: () => any[],
    changeRowPriority: (name: string, checked: boolean) => void,
    calculateUSDtokens: (t0: string, t1: string, amount0: string | number, amount1: string | number, isAorB: boolean) => string[];
    resetPairs: () => void;
    getPairChart: (pairPackageHash: string) => Promise<any>,
    getGlobalChart: () => Promise<any>,
    loadRewards: (tokenUSDPrices, wallet) => Promise<any>
    reloadGaugeAllowances: (wallet, name, decimals, contractHash, gaugePackageHash, action) => Promise<void>,
    getTVL: () => string
}

export const PairsContextProvider = createContext<PairsContext>({} as any)

export const PairsContext = ({children}: PairsContextProps) => {
    const { updateNotification } = notificationStore();
    const [pairState, pairDispatch] = useReducer(
        PairsReducer,
        initialPairsState
    );

    const resetPairs = () => pairDispatch({ type: PairActions.RESET });

    const orderedPairState: Record<string, PairTotalReserves> = PairsResponsibilities(pairState, pairDispatch).orderedPairState()

    const loadPairs = async (tokenState): Promise<Record<string, PairTotalReserves>> => {
       return await PairsResponsibilities(pairState, pairDispatch, tokenState).loadPairs()
    }

    const loadPairsUSD = async (pairsTotalReserves, tokenState) => {
        await PairsResponsibilities(pairState, pairDispatch, tokenState).loadPairsBalanceUSD(pairsTotalReserves, updateNotification)
    }

    const loadUserPairsData = async (wallet: Wallet, isConnected, tokenState) => {
        return await PairsResponsibilities(pairState, pairDispatch, tokenState).loadPairsUserData(wallet, isConnected)
    }

    const clearUserPairsData = async (pairState, tokenState) => {
        await PairsResponsibilities(pairState, pairDispatch, tokenState).clearUserPairsData()
    }

    const findReservesBySymbols = (symbolA, symbolB, tokenState) => PairsResponsibilities(pairState, pairDispatch, tokenState)
      .findReservesBySymbols(symbolA, symbolB, orderedPairState, updateNotification)

    const getPoolList = () => PairsResponsibilities(pairState, pairDispatch).getList()

    const changeRowPriority = (name, checked) => PairsResponsibilities(pairState, pairDispatch).changeRowPriority(name, checked)

    const calculateUSDtokens = (token0, token1, amount0, amount1, isAorB) => PairsResponsibilities(pairState, pairDispatch).calculateUSDtokens(token0, token1, amount0, amount1, isAorB)

    const getPairChart = async (pairPackageHash): Promise<any> => {
      return PairsResponsibilities(pairState, pairDispatch).getPairChart(pairPackageHash)
    }

    const getGlobalChart = async (): Promise<any> => {
      return PairsResponsibilities(pairState, pairDispatch).getGlobalChart()
    }

    const loadRewards = async (tokenUSDPrices, wallet): Promise<Record<string, PairTotalReserves>> => {
      return await PairsResponsibilities(pairState, pairDispatch).loadGralRewards(tokenUSDPrices, wallet)
    }

    const reloadGaugeAllowances = async (wallet, name, decimals, contractHash, gaugePackageHash, action): Promise<void> => {
      return PairsResponsibilities(pairState, pairDispatch).getAllowanceUpdated(wallet, name, decimals, contractHash, gaugePackageHash, action)
    }

    const getTVL = () => PairsResponsibilities(pairState, pairDispatch).getTVL(pairState)

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
            resetPairs,
            getPairChart,
            getGlobalChart,
            loadRewards,
            reloadGaugeAllowances,
            getTVL
        }}>
            {children}
        </PairsContextProvider.Provider>
    )

}

