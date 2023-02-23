import React, {createContext, ReactNode, useReducer} from 'react'
import {initialTokenState, TokenReducer} from '../../reducers/TokenReducers'
import TokenResponsibilities from '../../commons/TokenResponsibilities'
import {PairTotalReserves} from "../../commons/PairsResponsibilities";
import {Wallet} from "../../commons";


interface TokensContext {
    tokenState: any,
    loadTokensUSD: (pairsTotalReserves: Record<string, PairTotalReserves>, pairs, orderedPairState) => Promise<any>,
    loadTokensBalance: (wallet: Wallet, isConnected: boolean) => Promise<void>,
    clearTokensBalance: (tokenState) => Promise<void>,
    tokenDispatch,
    onSelectFirstToken,
    onSelectSecondToken,
    onSwitchTokens,
    firstTokenSelected: any,
    secondTokenSelected: any,
}

export const TokensProviderContext = createContext<TokensContext>({} as any)
export const TokensContext = ({children}: { children: ReactNode }) => {
    const [tokenState, tokenDispatch] = useReducer(
        TokenReducer,
        initialTokenState
    );
    const loadTokensUSD = async (pairsTotalReserves, pairs, orderedPairState): Promise<any> => {
        return TokenResponsibilities(tokenState, tokenDispatch).loadTokenUSD(pairsTotalReserves, pairs, orderedPairState)
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
            }}>
            {children}
        </TokensProviderContext.Provider>
    )
}
