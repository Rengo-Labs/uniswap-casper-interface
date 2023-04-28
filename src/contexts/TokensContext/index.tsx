import React, {createContext, ReactNode, useReducer} from 'react'
import {initialTokenState, TokenActions, TokenReducer, TokenState} from '../../reducers/TokenReducers'
import TokenResponsibilities from '../../commons/TokenResponsibilities'
import {PairTotalReserves} from "../../commons/PairsResponsibilities";
import {Token, Wallet} from "../../commons";
import {notificationStore} from "../../store/store";
import {PairState} from "../../reducers/PairsReducer";

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
    filterPopupTokens: (excludedTokens: any[]) => any[],
    filterTokenPairsByToken: (token: Token, pairState: PairState) => any[]
    resetTokens: () => void,
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

    const filterPopupTokens = (excludedTokens: any[]) : any[] => {
      return TokenResponsibilities(tokenState, tokenDispatch).filterPopupTokens(excludedTokens)
    }

    const filterTokenPairsByToken = (token, pairState): any[] => {
      return TokenResponsibilities(tokenState, tokenDispatch).filterTokenPairsByToken(token, pairState)
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
                resetTokens
            }}>
            {children}
        </TokensProviderContext.Provider>
    )
}
