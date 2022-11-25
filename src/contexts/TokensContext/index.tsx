import React, { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import { BASE_URL } from '../../constant';

import { initialTokenState, TokenReducer } from '../../reducers/TokenReducers'

export const TokensProviderContext = createContext<any>({})
export const TokensContext = ({ children }: { children: ReactNode }) => {


  const [state, dispatch] = useReducer(TokenReducer, initialTokenState);

  // function tokensToObject(listTokens) {

  //   return listTokens.reduce((acc, token) => {
  //     return {
  //       ...acc, [token.symbol]: {
  //         ...token,
  //         amount: "0.0000",
  //         symbolPair: token.symbol
  //       }
  //     };
  //   }, {})
  // }
  // const [load, loadSetter] = useState(true)

  // const withCallBack = useCallback(() => { loadTokens() }, [load])

  // function loadTokens() {
  //   fetch(`${BASE_URL}/tokensList`)
  //     .then(data => data.json())
  //     .then(tokenList => {
  //       dispatch({ type: "UPDATE_TOKENS", payload: { tokens: tokensToObject(tokenList.tokens) } })
  //     })
  //     .catch(err => console.error(err))
  // }

  // useEffect(() => {
  //   withCallBack()
  // }, [])
  //const [filterCriteria, filterCriteriaSet] = useState("")
  //const fileteredTokens = tokens.filter(token => token.fullname.acron.toLowerCase().includes(filterCriteria.toLowerCase()))
  return (
    <TokensProviderContext.Provider value={{ tokenState: state, tokenDispatch: dispatch }}>
      {children}
    </TokensProviderContext.Provider>
  )
}
