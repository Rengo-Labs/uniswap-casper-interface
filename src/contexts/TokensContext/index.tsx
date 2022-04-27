import React, { createContext, ReactNode, useReducer, useState } from 'react'

import { initialStateToken, TokenReducer } from '../../reducers/TokenReducers'

export const TokensProviderContext = createContext<any>({})
export const TokensContext = ({ children }: { children: ReactNode }) => {

  const [state, dispatch] = useReducer(TokenReducer, initialStateToken);
  //const [filterCriteria, filterCriteriaSet] = useState("")
  //const fileteredTokens = tokens.filter(token => token.fullname.acron.toLowerCase().includes(filterCriteria.toLowerCase()))
  return (
    <TokensProviderContext.Provider value={{ tokenState:state, tokenDispatch:dispatch }}>
      {children}
    </TokensProviderContext.Provider>
  )
}
