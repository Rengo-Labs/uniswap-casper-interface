import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {casperClient} from "../ConfigContext";
import {PairsContextProvider} from "../PairsContext";
import {TokensProviderContext} from "../TokensContext";
import {WalletProviderContext} from "../WalletContext";
import {PoolProviderContext} from "../PoolContext";

interface StateHashContextProps {
    children: ReactNode
}

interface StateHashContext {
    stateHash: string,
    setStateHash: (hash: string) => void,
    getLatestRootHash: () => Promise<string>,
    refresh: (wallet?) => Promise<void>,
    cstMarket?: string,
    tvl?: string
}

export const StateHashProviderContext = createContext<StateHashContext>({} as any)

export const StateHashContext = ({children}: StateHashContextProps) => {
    const [stateHash, setStateHash] = useState<string>('')
    const [cstMarket, setCSTMarket] = useState('0')
    const [tvl, setTVL] = useState('0')
    const {loadPairs, loadPairsUSD, loadUserPairsData, clearUserPairsData, pairState, loadRewards, getTVL} = useContext(PairsContextProvider)
    const {tokenState, loadTokensBalance, loadTokensUSD, clearTokensBalance, getCSTMarket} = useContext(TokensProviderContext)
    const {walletState} = useContext(WalletProviderContext)

    const {previousQuery} = useContext(PoolProviderContext)

    const getLatestRootHash = useCallback(async () => {
        return casperClient.getStateRootHash()
    }, [])

    const getPairs = useCallback(async () => {
        const pairsToReserves = await loadPairs(tokenState)
        await loadPairsUSD(pairsToReserves, tokenState)
        return pairsToReserves
    }, [stateHash, walletState])

    const getRewards = useCallback(async (tokenUSDPrices) => {
        const rewards = await loadRewards(tokenUSDPrices, walletState.wallet)

        return rewards
    }, [stateHash, walletState])

    const getTokens = useCallback(async (pairsToReserves) => {
        return await loadTokensUSD(pairsToReserves, pairState)
    }, [stateHash, walletState])

    const loadUserData = useCallback(async () => {

        const isConnected = walletState.wallet?.isConnected ?? false
        if (walletState?.wallet) {
            await loadUserPairsData(walletState?.wallet, isConnected, tokenState)
            await loadTokensBalance(walletState?.wallet, isConnected)
        }
        // TODO this part of code delays more than reset data
        else {
            await clearUserPairsData(pairState, tokenState)
            await clearTokensBalance(tokenState)
        }

        //todo delete this in the future
        previousQuery()
    }, [stateHash, walletState.wallet?.isConnected, walletState?.wallet?.publicKey])

    // TODO call this function on manual refresh
    const refresh = async () => {
        // si tenemos la wallet y sea manual
        await getRootHash()
        setTVL(getTVL())
        setCSTMarket(getCSTMarket())
    }

    useEffect(() => {
        const loadAndRefresh = async () => {
            const pairsToReserves = await getPairs()
            const tokenUSDPrices = await getTokens(pairsToReserves)
            await loadUserData()
            await getRewards(tokenUSDPrices)
        }

        loadAndRefresh().then(() => console.log('#### loaded pairs and tokens with StateHashContext ####'))
    },  [stateHash, walletState?.wallet?.isConnected, walletState?.wallet?.publicKey])

    const getRootHash = useCallback(async () => {
        const rootHash = await getLatestRootHash()
        if (rootHash !== stateHash) {
            setStateHash(rootHash)
        }
    }, [stateHash, walletState?.wallet])

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
        cstMarket,
        tvl
    }), [stateHash, setStateHash, getLatestRootHash])

    return (
        <StateHashProviderContext.Provider value={value}>
            { children }
        </StateHashProviderContext.Provider>
    )
}
