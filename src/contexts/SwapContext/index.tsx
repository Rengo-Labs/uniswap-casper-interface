import React, { createContext, ReactNode, useReducer, useState } from 'react'

import { initialStateWallet, reducerWallet } from '../../reducers/WalletReducers'

export const SwapProviderContext = createContext<any>({})

export const SwapContext = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducerWallet, initialStateWallet);
    //const [filterCriteria, filterCriteriaSet] = useState("")
    //const fileteredSwap = Swap.filter(token => token.fullname.acron.toLowerCase().includes(filterCriteria.toLowerCase()))
    return (
        <SwapProviderContext.Provider value={{ state, dispatch }}>
            {children}
        </SwapProviderContext.Provider>
    )
}
