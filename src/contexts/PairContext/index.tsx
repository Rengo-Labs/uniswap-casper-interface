import {ReactNode, createContext, useReducer, useEffect, useContext, useCallback} from "react";
import {initialPairsState, PairActions, PairsReducer, PairState} from "../../reducers/PairsReducer";
import {StateHashContext} from "../StateHashContext";
import {getPairData} from "../../commons/api/ApolloQueries";
import store from "store2";
import {convertBigNumberToUIString, log} from "../../commons";
import BigNumber from "bignumber.js";
import {apiClient} from "../ConfigContext";


// TODO CREAR ARCHIVO DE TIPO PARA ESTO
interface PairContextProps {
    children: ReactNode
}
interface PairContext {
    pairState: PairState,
}

interface PairTotalReserves {
    totalReserve0: BigNumber.Value,
    totalReserve1: BigNumber.Value,
}
export const PAIRS: PairState = {}

const PairContextProvider = createContext<PairContext>({} as any)
export const PairContext = ({children}: PairContextProps) => {
    const {stateHash} = useContext(StateHashContext)

    const [pairState, pairDispatch] = useReducer(
        PairsReducer,
        initialPairsState
    );

    const loadPairs = useCallback(async () => {
        // try {
        //     const pairs = Object.values(pairState)
        //     const pairTotalReserves: Record<string, PairTotalReserves> = {}
        //
        //     const infoResultMap: Record<string, any> = {}
        //
        //     try {
        //         const infoResults = await getPairData(pairs.map(pl => pl.packageHash.substr(5)))
        //         infoResults.map(pl => infoResultMap[`hash-${pl.id}`] = pl)
        //     } catch (e) {
        //         console.log(`graphql error: ${e}`)
        //     }
        //
        //     const results = await Promise.all(pairs.map(async (pl) => {
        //
        //         const pairChecked = store.get(pl.name)
        //         changeRowPriority(pl.name, pairChecked)
        //
        //         const pairDataResponse = await apiClient.getPairData(pl.contractHash)
        //         const token0Decimals = tokenState.tokens[pl.token0Symbol].decimals;
        //         const token1Decimals = tokenState.tokens[pl.token1Symbol].decimals;
        //         const reserve0 = convertBigNumberToUIString(
        //             new BigNumber(pairDataResponse.reserve0),
        //             token0Decimals
        //         );
        //         const reserve1 = convertBigNumberToUIString(
        //             new BigNumber(pairDataResponse.reserve1),
        //             token1Decimals
        //         );
        //
        //         const infoResult = infoResultMap[pl.packageHash] ?? {
        //             oneWeekVoluemUSD: 0,
        //             oneDayVoluemUSD: 0,
        //             reserveUSD: 0,
        //         }
        //
        //         return {
        //             name: pl.name,
        //             orderedName: pl.orderedName,
        //             totalReserve0: reserve0,
        //             totalReserve1: reserve1,
        //             volume7d: new BigNumber(infoResult.oneWeekVolumeUSD).div(10**pl.decimals).toFixed(2),
        //             volume1d: new BigNumber(infoResult.oneDayVolumeUSD).div(10**pl.decimals).toFixed(2),
        //             totalSupply: convertBigNumberToUIString(
        //                 new BigNumber(pairDataResponse.totalSupply)
        //             ),
        //             totalLiquidityUSD: convertBigNumberToUIString(
        //                 new BigNumber(infoResult ? infoResult.reserveUSD : 0)
        //             )
        //         }
        //     }))
        //     for (const pl of results) {
        //
        //         pairDispatch({
        //             type: PairActions.LOAD_PAIR,
        //             payload: {
        //                 name: pl.name,
        //                 volume7d: pl.volume7d,
        //                 volume1d: pl.volume1d,
        //                 totalReserve0: pl.totalReserve0,
        //                 totalReserve1: pl.totalReserve1,
        //                 totalSupply: pl.totalSupply,
        //                 totalLiquidityUSD: pl.totalLiquidityUSD
        //             },
        //         })
        //
        //         pairTotalReserves[pl.orderedName] = {
        //             totalReserve0: pl.totalReserve0,
        //             totalReserve1: pl.totalReserve1,
        //         }
        //     }
        //
        //     console.log('pairTotalReserves', pairTotalReserves)
        //
        //     await loadPairsUSD(pairTotalReserves)
        // } catch (err) {
        //     log.error('loadPairs', err.message);
        // }


    }, [])

    const refresh = useCallback( async () => {
        console.log('#### refreshing pair state ####');
        // load pairs
    }, [])

    // escuchamos estado del hash
    useEffect(() => {
         console.log('#### stateHash value ####', stateHash)
        // refresh pair state and actions
        refresh().then(() => console.log('#### pair state refreshed ####'))
    }, [stateHash])

    // dwfinir funciones para construir el pair

    return (
        <PairContextProvider.Provider value={{pairState}}>
            {children}
        </PairContextProvider.Provider>
    )
}
