import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {casperClient} from "../ConfigContext";
import {PairsContextProvider} from "../PairsContext";
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
    const {loadPairs} = useContext(PairsContextProvider)

    const getLatestRootHash = useCallback(async () => {
        return casperClient.getStateRootHash()
    }, [])

    const getPairs = useCallback(async () => {
        // TODO traer toda la info de los pairs o llamar a las funciones que necesitemos
        await loadPairs()
    }, [])

    const getTokens = useCallback(async () => {
        // TODO traer toda la info de los tokens o llamar a las funciones que necesitemos
    }, [])

    useEffect(() => {
        getPairs().then(() => console.log('#### pairs loaded with StateHashContext ####'))

    },  [stateHash])

    const getRootHash = useCallback(async () => {
        const rootHash = await getLatestRootHash()
        if (rootHash !== stateHash) {
            setStateHash(rootHash)
        }
    }, [])

    console.log('#### stateHash value ####', stateHash)

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
