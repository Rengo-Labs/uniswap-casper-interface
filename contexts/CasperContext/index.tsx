import React, { createContext, useEffect, useState } from 'react'

import { checkConnection, getActiveKeyFromSigner, connectToSigner } from './utils'


export const CasperProviderContext = createContext<any>("")


export const CasperContext = ({ children }) => {
    let [menuOpenedClass, setMenuOpenedClass] = useState();
    let [signerLocked, setSignerLocked] = useState()
    let [signerConnected, setSignerConnected] = useState(false)
    let [isLoading] = useState(false);
    useEffect(() => {
        setTimeout(async () => {
            try {
                const connected = await checkConnection();
                console.log("connected")
                //setSignerConnected(connected)
            } catch (err) {
                console.log(err)
            }
        }, 100);

        window.addEventListener('signer:connected', msg => {
            console.log('signer:connected', msg)
        });
        window.addEventListener('signer:disconnected', msg => {
            console.log('signer:disconnected', msg)
        });
        window.addEventListener('signer:tabUpdated', msg => {
            console.log('signer:tabUpdated', msg)
        });
        window.addEventListener('signer:activeKeyChanged', msg => {
            console.log('signer:activeKeyChanged', msg)

        });
        window.addEventListener('signer:locked', msg => {
            console.log('signer:locked', msg)
        });
        window.addEventListener('signer:unlocked', msg => {
            console.log('signer:unlocked', msg)

        });
        window.addEventListener('signer:initialState', msg => {
            console.log('signer:initialState', msg);
        });
        // eslint-disable-next-line
    }, []);
    return (
        <CasperProviderContext.Provider value={{ checkConnection, getActiveKeyFromSigner, connectToSigner }}>
            {children}
        </CasperProviderContext.Provider>
    )
}
