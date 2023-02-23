import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {casperClient} from "../ConfigContext";
import {PairsContextProvider} from "../PairsContext";
import {TokensProviderContext} from "../TokensContext";
import {Network, Wallet, WalletName} from "../../commons";
import {ConfigState} from "../../reducers/ConfigReducers";

interface StateHashContextProps {
    children: ReactNode
}

interface StateHashContext {
    stateHash: string,
    setStateHash: (hash: string) => void,
    getLatestRootHash: () => Promise<string>,
    refresh: (wallet?) => Promise<void>,
    setConfigState?: (config: ConfigState) => void
}

export const StateHashProviderContext = createContext<StateHashContext>({} as any)

export const StateHashContext = ({children}: StateHashContextProps) => {
    const [stateHash, setStateHash] = useState<string>('')
    const {loadPairs, loadPairsUSD, loadUserPairsData, clearUserPairsData, pairState, orderedPairState} = useContext(PairsContextProvider)
    const {tokenState, loadTokensBalance, loadTokensUSD, clearTokensBalance} = useContext(TokensProviderContext)
    const [configState, setConfigState] = useState<ConfigState>(null)
    // TODO Probar cuando tengamos filtros
    //const {currentQuery, instance} = useContext(PoolProviderContext)
    // TODO conetar la wallet y traer el contexto

    useEffect(() => {
        console.log("Cambio?", configState)
    }, [configState])

    const getLatestRootHash = useCallback(async () => {
        return casperClient.getStateRootHash()
    }, [])

    const getPairs = useCallback(async () => {
        const pairsToReserves = await loadPairs(tokenState)
        await loadPairsUSD(pairsToReserves)
        return pairsToReserves
    }, [])

    const getTokens = useCallback(async (pairsToReserves) => {
        //TODO wallet connection
        await loadTokensUSD(pairsToReserves, pairState, orderedPairState)
    }, [])

    const loadUserData = useCallback(async () => {
        //TODO wallet connection borrar y usar el que viene del contexto

        console.log("Checking information", configState?.wallet)
        if (! configState?.wallet) {
            return;
        }
        const isConnected = configState.wallet.isConnected

        console.log("wallet conectada", configState?.wallet)
        if (configState?.wallet) {
            await loadUserPairsData(configState?.wallet, isConnected)
            await loadTokensBalance(configState?.wallet, isConnected)
        } else {
            await clearUserPairsData(pairState)
            await clearTokensBalance(tokenState)
        }

        //TODO REVISAR ESTO
        // instance.changeData(currentQuery)
    }, [])

    const refresh = useCallback(async () => {
        // si tenemos la wallet y sea manual
        await getRootHash()
    },[])

    useEffect(() => {
        const loadAndRefresh = async () => {
            const pairsToReserves = await getPairs()
            console.log("pairs completed")
            await getTokens(pairsToReserves)
            await loadUserData()
        }

        loadAndRefresh().then(() => console.log('#### loaded pairs and tokens with StateHashContext ####'))
    },  [stateHash, configState])

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
        getLatestRootHash,
        refresh,
        setConfigState
    }), [stateHash, setStateHash, getLatestRootHash])

    return (
        <StateHashProviderContext.Provider value={value}>
            { children }
        </StateHashProviderContext.Provider>
    )
}
