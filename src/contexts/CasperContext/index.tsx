import React, { createContext, useEffect, useState } from 'react'

import { checkConnection, getActiveKeyFromSigner, connectToSigner } from './utils'


export const CasperProviderContext = createContext<any>("")


export const CasperContext = ({ children }) => {

    return (
        <CasperProviderContext.Provider value={{ checkConnection, getActiveKeyFromSigner, connectToSigner }}>
            {children}
        </CasperProviderContext.Provider>
    )
}
