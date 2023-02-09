import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react'

import {casperClient} from "../ConfigContext";

interface StateHashContextProps {
    children: ReactNode
}

interface StateHashContext {
    stateHash: string,
    setStateHash: (hash: string) => void,
    getLatestRootHash: () => Promise<string>
}

export const StateHashContext = createContext<StateHashContext>({} as any)

export const StateHashProvideContext = ({children}: StateHashContextProps) => {
    const [stateHash, setStateHash] = useState<string>('')

    const getLatestRootHash = useCallback(async () => {
        return casperClient.getStateRootHash()
    }, [])

    const getRootHash = useCallback(async () => {
        const rootHash = await getLatestRootHash()
        if (rootHash !== stateHash) {
            setStateHash(rootHash)
        }
    }, [])

    // TODO borrar esto cuando terminemos de probar
    useEffect(() => {
        console.log('#### stateHash value ####', stateHash)
    }, [stateHash])

    useEffect(() => {
        getRootHash()
            .then(() => console.log('#### root hash running first time ####'))
            .catch((err) => console.log(err))

        const interval = setInterval(() => {
            getRootHash()
                .then(() => console.log('###### root hash updated ######'))
                .catch((err) => console.log(err))
        }, 20000)

        return () => clearInterval(interval)
    }, [])

    const value = useMemo(() => ({
        stateHash,
        setStateHash,
        getLatestRootHash
    }), [stateHash, setStateHash, getLatestRootHash])

    return (
        <StateHashContext.Provider value={value}>
            { children }
        </StateHashContext.Provider>
    )
}
