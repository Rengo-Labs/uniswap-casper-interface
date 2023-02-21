import React, { createContext, ReactNode, useReducer } from 'react'
import {initialTokenState, TokenReducer} from '../../reducers/TokenReducers'
import TokenResponsibilities from '../../commons/TokenResponsibilities'
import {PairTotalReserves} from "../../commons/PairsResponsibilities";
import {Wallet} from "../../commons";


interface TokensContext {
  tokenState: any,
  loadTokensUSD: (pairsTotalReserves: Record<string, PairTotalReserves>, pairs, orderedPairState) => Promise<any>,
  loadTokensBalance: (wallet: Wallet, isConnected: boolean) => Promise<void>,
  clearTokensBalance: (tokenState) => Promise<void>,
  tokenDispatch
}

export const TokensProviderContext = createContext<TokensContext>({} as any)
export const TokensContext = ({ children }: { children: ReactNode }) => {
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

  return (
    <TokensProviderContext.Provider value={{ tokenState, tokenDispatch, loadTokensUSD, loadTokensBalance, clearTokensBalance }}>
      {children}
    </TokensProviderContext.Provider>
  )
}
