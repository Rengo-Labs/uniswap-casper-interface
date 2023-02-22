import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {casperClient} from "../ConfigContext";
import {PairsContextProvider} from "../PairsContext";
import {TokensProviderContext} from "../TokensContext";
import {Network, Wallet, WalletName} from "../../commons";

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
    // TODO Probar cuando tengamos filtros
    //const {currentQuery, instance} = useContext(PoolProviderContext)
    // TODO conetar la wallet y traer el contexto

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
        const wallet = {
            isConnected: true,
            network: Network.CASPER_TESTNET,
            name: WalletName.NONE,
            publicKey: undefined,
            publicKeyHex: '',
            accountHash: undefined,
            accountHashString: ''
        } as any;
        const isConnected = wallet.isConnected

        if (wallet) {
            await loadUserPairsData(wallet, isConnected)
            await loadTokensBalance(wallet, isConnected)
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
