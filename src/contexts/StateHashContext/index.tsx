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
    refresh: (wallet?) => Promise<void>
}

export const StateHashProviderContext = createContext<StateHashContext>({} as any)

export const StateHashContext = ({children}: StateHashContextProps) => {
    const [stateHash, setStateHash] = useState<string>('')
    const {loadPairs, loadPairsUSD, loadUserPairsData, clearUserPairsData, pairState, resetPairs, loadRewards} = useContext(PairsContextProvider)
    const {tokenState, loadTokensBalance, loadTokensUSD, clearTokensBalance, resetTokens} = useContext(TokensProviderContext)
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

    const getRewards = useCallback(async (tokenUSDPrices, stakingList) => {
        const rewards = await loadRewards(tokenUSDPrices, stakingList)

        return rewards
    }, [stateHash, walletState])

    const getTokens = useCallback(async (pairsToReserves) => {
        return await loadTokensUSD(pairsToReserves, pairState)
    }, [stateHash, walletState])

    const loadUserData = useCallback(async () => {

        let stakingList
        const isConnected = walletState.wallet?.isConnected ?? false
        if (walletState?.wallet) {
            stakingList = await loadUserPairsData(walletState?.wallet, isConnected, tokenState)
            await loadTokensBalance(walletState?.wallet, isConnected)
        }
        // TODO this part of code delays more than reset data
        else {
            await clearUserPairsData(pairState, tokenState)
            await clearTokensBalance(tokenState)
        }

        //todo delete this in the future
        previousQuery()
        return stakingList ?? new Map()
    }, [stateHash, walletState.wallet?.isConnected, walletState?.wallet?.publicKey])

    // TODO call this function on manual refresh
    const refresh = async () => {
        // si tenemos la wallet y sea manual
        await getRootHash()
    }

    useEffect(() => {
        const loadAndRefresh = async () => {
            const pairsToReserves = await getPairs()
            const tokenUSDPrices = await getTokens(pairsToReserves)
            const stakingList = await loadUserData()
            await getRewards(tokenUSDPrices, stakingList)
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
        refresh
    }), [stateHash, setStateHash, getLatestRootHash])

    return (
        <StateHashProviderContext.Provider value={value}>
            { children }
        </StateHashProviderContext.Provider>
    )
}
