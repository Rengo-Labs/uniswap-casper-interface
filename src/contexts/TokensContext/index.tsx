import React, {createContext, ReactNode, useReducer} from 'react'
import {initialTokenState, TokenReducer, TokenState} from '../../reducers/TokenReducers'
import TokenResponsibilities from '../../commons/TokenResponsibilities'
import {PairTotalReserves} from "../../commons/PairsResponsibilities";
import {Wallet} from "../../commons";
import {notificationStore} from "../../store/store";

interface TokensContext {
    tokenState: TokenState,
    loadTokensUSD: (pairsTotalReserves: Record<string, PairTotalReserves>, pairs) => Promise<any>,
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
    const { updateNotification } = notificationStore();
    const [tokenState, tokenDispatch] = useReducer(
        TokenReducer,
        initialTokenState
    );
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
