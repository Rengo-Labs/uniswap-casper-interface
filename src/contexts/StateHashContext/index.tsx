import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {casperClient} from "../ConfigContext";
import {PairsContextProvider} from "../PairsContext";
import {TokensProviderContext} from "../TokensContext";
import {ConfigState} from "../../reducers/ConfigReducers";
import {WalletProviderContext} from "../WalletContext";
import {PoolProviderContext} from "../PoolContext";

interface StateHashContextProps {
    children: ReactNode
}

interface StateHashContext {
    stateHash: string,
    setStateHash: (hash: string) => void,
    getLatestRootHash: () => Promise<string>,
    refresh: (wallet?) => Promise<void>
}

export const StateHashProviderContext = createContext<StateHashContext>({} as any)

export const StateHashContext = ({children}: StateHashContextProps) => {
    const [stateHash, setStateHash] = useState<string>('')
    const {loadPairs, loadPairsUSD, loadUserPairsData, clearUserPairsData, pairState} = useContext(PairsContextProvider)
    const {tokenState, loadTokensBalance, loadTokensUSD, clearTokensBalance} = useContext(TokensProviderContext)
    const {walletState} = useContext(WalletProviderContext)

    //const [configState, setConfigState] = useState<ConfigState>(null)
    // TODO Probar cuando tengamos filtros
    const {previousQuery} = useContext(PoolProviderContext)

    const getLatestRootHash = useCallback(async () => {
        return casperClient.getStateRootHash()
    }, [])

    const getPairs = useCallback(async () => {
        const pairsToReserves = await loadPairs(tokenState)
        await loadPairsUSD(pairsToReserves)
        return pairsToReserves
    }, [stateHash])

    const getTokens = useCallback(async (pairsToReserves) => {
        //TODO wallet connection
        await loadTokensUSD(pairsToReserves, pairState)
    }, [stateHash])

    const loadUserData = useCallback(async () => {
        if (!walletState?.wallet) {
            return;
        }
        const isConnected = walletState.wallet.isConnected

        if (walletState?.wallet) {
            await loadUserPairsData(walletState?.wallet, isConnected)
            await loadTokensBalance(walletState?.wallet, isConnected)
        } else {
            await clearUserPairsData(pairState)
            await clearTokensBalance(tokenState)
        }

        previousQuery()
    }, [stateHash, walletState])

    // TODO llamar cuandos sea manual
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
        getLatestRootHash,
        refresh
    }), [stateHash, setStateHash, getLatestRootHash])

    return (
        <StateHashProviderContext.Provider value={value}>
            { children }
        </StateHashProviderContext.Provider>
    )
}
