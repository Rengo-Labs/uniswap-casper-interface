import React, {createContext, ReactNode, useReducer} from 'react'
import {initialTokenState, TokenActions, TokenReducer, TokenState} from '../../reducers/TokenReducers'
import TokenResponsibilities from '../../commons/TokenResponsibilities'
import {PairTotalReserves} from "../../commons/PairsResponsibilities";
import {Token, Wallet} from "../../commons";
import {notificationStore} from "../../store/store";
import {PairState} from "../../reducers/PairsReducer";
import {TokenProfit} from "../../commons/api/ApolloQueries";

interface TokensContext {
    tokenState: TokenState,
    loadTokensUSD: (pairsTotalReserves: Record<string, PairTotalReserves>, pairs) => Promise<any>,
    loadTokensBalance: (wallet: Wallet, isConnected: boolean) => Promise<void>,
    clearTokensBalance: (tokenState) => Promise<void>,
    tokenDispatch,
    onSelectFirstToken,
    onSelectSecondToken,
    onSwitchTokens,
    firstTokenSelected: Token,
    secondTokenSelected: Token,
    filterPopupTokens: (excludedTokens: any[], position: number, hasCSPR: boolean) => any[],
    filterTokenPairsByToken: (token: Token, pairState: PairState) => any[]
    resetTokens: () => void,
    getHistoricalTokenPrices?: (packageHash: string) => Promise<any>,
    getBalancesProfit?: (packageHash: string) => Promise<TokenProfit>,
    getHistoricalTokensChartPrices?: (packageHash0: string, packageHash1: string) => Promise<any[]>
}

export const TokensProviderContext = createContext<TokensContext>({} as any)
export const TokensContext = ({children}: { children: ReactNode }) => {
    const { updateNotification } = notificationStore();
    const [tokenState, tokenDispatch] = useReducer(
        TokenReducer,
        initialTokenState
    );

    const resetTokens = () => tokenDispatch({ type: TokenActions.RESET });

    const loadTokensUSD = async (pairsTotalReserves, pairs): Promise<any> => {
        return TokenResponsibilities(tokenState, tokenDispatch).loadTokenUSD(pairsTotalReserves, pairs, updateNotification)
    }

    const loadTokensBalance = async (wallet: Wallet, isConnected: boolean): Promise<any> => {
        return TokenResponsibilities(tokenState, tokenDispatch).updateBalances(wallet, isConnected)
    }

    const clearTokensBalance = async (tokenState): Promise<any> => {
        return TokenResponsibilities(tokenState, tokenDispatch).clearUserTokensData()
    }

    const onSelectFirstToken = (token) : void => {
        return TokenResponsibilities(tokenState, tokenDispatch).onSelectFirstToken(token)
    }

    const onSelectSecondToken = (token) : void => {
        return TokenResponsibilities(tokenState, tokenDispatch).onSelectSecondToken(token)
    }

    const onSwitchTokens = () : void => {
        return TokenResponsibilities(tokenState, tokenDispatch).onSwitchTokens()
    }

    const filterPopupTokens = (excludedTokens: any[], position: number, firstToken: boolean) : any[] => {
      return TokenResponsibilities(tokenState, tokenDispatch).filterPopupTokens(excludedTokens, position, firstToken)
    }

    const filterTokenPairsByToken = (token, pairState): any[] => {
      return TokenResponsibilities(tokenState, tokenDispatch).filterTokenPairsByToken(token, pairState)
    }

    const getHistoricalTokenPrices = async (packageHash: string): Promise<any> => {
      return TokenResponsibilities(tokenState, tokenDispatch).getHistoricalTokenPrices(packageHash)
    }

    const getBalancesProfit = async (packageHash: string): Promise<any> => {
      return TokenResponsibilities(tokenState, tokenDispatch).getBalancesProfit(packageHash)
    }

    const getHistoricalTokensChartPrices = async (packageHash0: string, packageHash1: string): Promise<any> => {
      return TokenResponsibilities(tokenState, tokenDispatch).getHistoricalTokensChartPrices(packageHash0, packageHash1)
    }

    return (
        <TokensProviderContext.Provider
            value={{
                tokenState,
                tokenDispatch,
                loadTokensUSD,
                loadTokensBalance,
                clearTokensBalance,
                onSelectFirstToken,
                onSelectSecondToken,
                onSwitchTokens,
                firstTokenSelected: tokenState.tokens[tokenState.firstTokenSelected],
                secondTokenSelected: tokenState.tokens[tokenState.secondTokenSelected],
                filterPopupTokens,
                filterTokenPairsByToken,
                resetTokens,
                getHistoricalTokenPrices,
                getBalancesProfit,
                getHistoricalTokensChartPrices
            }}>
            {children}
        </TokensProviderContext.Provider>
    )
}
