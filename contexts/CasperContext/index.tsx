import React, { createContext, useEffect, useState } from 'react'

import { checkConnection, getActiveKeyFromSigner, connectToSigner } from './utils'


export const CasperProviderContext = createContext<any>("")


export const CasperContext = ({ children }) => {
    let [menuOpenedClass, setMenuOpenedClass] = useState();
    let [signerLocked, setSignerLocked] = useState()
    let [signerConnected, setSignerConnected] = useState(false)
    let [isLoading] = useState(false);

    return (
        <CasperProviderContext.Provider value={{ checkConnection, getActiveKeyFromSigner, connectToSigner }}>
            {children}
        </CasperProviderContext.Provider>
    )
}
