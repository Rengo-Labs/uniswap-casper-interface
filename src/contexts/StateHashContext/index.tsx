import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {casperClient} from "../ConfigContext";
import {PairsContextProvider} from "../PairsContext";
import {TokensProviderContext} from "../TokensContext";
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
    const {loadPairs, loadPairsUSD, loadUserPairsData, clearUserPairsData, pairState, orderedPairState} = useContext(PairsContextProvider)
    const {tokenState, loadTokensBalance, loadTokensUSD, clearTokensBalance} = useContext(TokensProviderContext)


    const getLatestRootHash = useCallback(async () => {
        return casperClient.getStateRootHash()
    }, [])

    const getPairs = useCallback(async () => {
        const pairsToReserves = await loadPairs(tokenState)
        await loadPairsUSD(pairsToReserves)


        //TODO wallet connection
        //await loadUserPairsData(wallet, isConnected)
        //await clearUserPairsData(pairState)

        return pairsToReserves
    }, [])

    const getTokens = useCallback(async (pairsToReserves) => {


        //TODO wallet connection
        //await loadTokensBalance(wallet, isConnected)
        //await clearTokensBalance(tokenState)

        await loadTokensUSD(pairsToReserves, pairState, orderedPairState)

    }, [])

    useEffect(() => {
        const load = async () => {
            const pairsToReserves = await getPairs()
            console.log("pairs completed")
            await getTokens(pairsToReserves)
        }

        load().then(() => console.log('#### loaded pairs and tokens with StateHashContext ####'))
    },  [stateHash])

    const getRootHash = useCallback(async () => {
        const rootHash = await getLatestRootHash()
        if (rootHash !== stateHash) {
            setStateHash(rootHash)
        }
    }, [])

    console.log('#### stateHash value ####', stateHash)

    useEffect(() => {

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
