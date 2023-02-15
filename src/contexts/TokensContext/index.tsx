import React, { createContext, ReactNode, useReducer } from 'react'
import { initialTokenState, TokenReducer } from '../../reducers/TokenReducers'
import TokenResponsibilities from '../../commons/TokenResponsibilities'

export const TokensProviderContext = createContext<any>({})
export const TokensContext = ({ children }: { children: ReactNode }) => {
  const [tokenState, tokenDispatch] = useReducer(
      TokenReducer,
      initialTokenState
  );

  const loadToken = async (): Promise<void> => {
    await TokenResponsibilities(tokenState, tokenDispatch).loadToken()
  }

  return (
    <TokensProviderContext.Provider value={{ tokenState, tokenDispatch }}>
      {children}
    </TokensProviderContext.Provider>
  )
}
