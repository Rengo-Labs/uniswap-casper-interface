import {getPairData} from "../api/ApolloQueries";
import store from "store2";
import {convertBigNumberToUIString, log} from "../utils";
import BigNumber from "bignumber.js";
import {PairActions, PairData, PairState} from "../../reducers/PairsReducer";
import {apiClient, PairReserves} from "../../contexts/ConfigContext";
import {Wallet} from "../wallet";
import {TokenState} from "../../reducers/TokenReducers";
import {pairFinder} from "../pairFinder";

export interface PairTotalReserves {
    totalReserve0: BigNumber.Value,
    totalReserve1: BigNumber.Value,
}

const PairsResponsibilities = (pairState: PairState, pairDispatch, tokenState?: TokenState) => {
    const orderedPairState = () : Record<string, PairTotalReserves> => {
        const orderedPairs: Record<string, PairTotalReserves> = {}
        Object.values(pairState).map((pl) => {
            orderedPairs[pl.orderedName] = pl
        })
        return orderedPairs
    }

    const changeRowPriority = (name, priority) => {
        store.set(name, priority)
        pairDispatch({
            type: PairActions.CHANGE_PRIORITY,
            payload: {
                name: name,
                checked: priority
            }
        });
    }

    async function loadPairsUSD(pairTotalReserves: Record<string, PairTotalReserves>, pairs, updateNotification): Promise<void> {
        try {
            const instance = pairFinder(pairState, tokenState)
            for (const p of pairs) {
                const price0USD = instance.findUSDRateBySymbol(p.token0Symbol, pairTotalReserves, updateNotification).toString()
                const price1USD = instance.findUSDRateBySymbol(p.token1Symbol, pairTotalReserves, updateNotification).toString()

                pairDispatch({
                    type: PairActions.LOAD_PAIR_USD,
                    payload: {
                        name: p.name,
                        token0Price: price0USD,
                        token1Price: price1USD,
                    },
                })
            }
        } catch (err) {
            log.error('loadPairsUSD - PairsResponsibility', err.message);
        }
    }

    async function loadPairsUserData(wallet: Wallet, isConnected = false): Promise<void> {
        if (!isConnected) {
            return;
        }

        try {
            const ps = [];
            const pairList = Object.keys(pairState).map((x) => pairState[x]);
            for (const pair of pairList) {
                ps.push(
                    apiClient
                        .getERC20Allowance(
                            wallet,
                            pair.contractHash,
                        )
                        .then((response) => {
                            pairDispatch({
                                type: PairActions.ADD_ALLOWANCE_TO_PAIR,
                                payload: {
                                    name: pair.name,
                                    allowance: convertBigNumberToUIString(
                                        new BigNumber(response)
                                    ),
                                },
                            });
                        }),
                    apiClient
                        .getERC20Balance(
                            wallet,
                            pair.contractHash,
                        )
                        .then((response) => {
                            pairDispatch({
                                type: PairActions.ADD_BALANCE_TO_PAIR,
                                payload: {
                                    name: pair.name,
                                    balance: convertBigNumberToUIString(
                                        new BigNumber(response)
                                    ),
                                },
                            });
                        }),
                )
            }

            await Promise.all(ps);
        } catch (err) {
            log.error('fillPairs - PairsResponsibility', err.message);
        }
    }

    const loadLatestPairsData = async (pairs) => {
        //console.log('loadLatestPairsData from PairsResponsibility')
        const infoResultMap: Record<string, any> = {}
        try {
            const infoResults = await getPairData(pairs.map(pl => pl.packageHash.substr(5)))
            infoResults.map(pl => infoResultMap[`hash-${pl.id}`] = pl)

            return infoResultMap
        } catch (e) {
            console.log(`graphql error - PairsResponsibility: ${e}`)
            return []
        }
    }

    const getInfoResult = (infoResultMap) => {
        const {packageHash} = infoResultMap
        return infoResultMap[packageHash] ?? {
            oneWeekVoluemUSD: 0,
            oneDayVoluemUSD: 0,
            reserveUSD: 0,
        }
    }

    const getGeneralPairData = async (pairs, pairsMap) => {
        //console.log('getGeneralPairData from PairsResponsibility')
        const results = await Promise.all(pairs.map(async (pl) => {

            const pairChecked = store.get(pl.name)
            changeRowPriority(pl.name, pairChecked)

            const pairDataResponse = await apiClient.getPairData(pl.contractHash)

            const tokens = tokenState.tokens

            const token0Decimals = tokens[pl.token0Symbol].decimals;
            const token1Decimals = tokens[pl.token1Symbol].decimals;
            const reserve0 = convertBigNumberToUIString(
                new BigNumber(pairDataResponse.reserve0),
                token0Decimals
            );
            const reserve1 = convertBigNumberToUIString(
                new BigNumber(pairDataResponse.reserve1),
                token1Decimals
            );

            const infoResult = pairsMap[pl.packageHash] ?? {
                oneWeekVoluemUSD: 0,
                oneDayVoluemUSD: 0,
                reserveUSD: 0,
            }

            return {
                name: pl.name,
                orderedName: pl.orderedName,
                totalReserve0: reserve0,
                totalReserve1: reserve1,
                volume7d: new BigNumber(infoResult.oneWeekVolumeUSD).div(10 ** pl.decimals).toFixed(2),
                volume1d: new BigNumber(infoResult.oneDayVolumeUSD).div(10 ** pl.decimals).toFixed(2),
                totalSupply: convertBigNumberToUIString(
                    new BigNumber(pairDataResponse.totalSupply)
                ),
                totalLiquidityUSD: convertBigNumberToUIString(
                    new BigNumber(infoResult ? infoResult.reserveUSD : 0)
                )
            }
        }))

        return results
    }

    const updateGeneralPairData = async (results) => {
        //console.log('updateGeneralPairData from PairsResponsibility')
        const pairTotalReserves: Record<string, PairTotalReserves> = {}
        for (const pl of results) {
            pairDispatch({
                type: PairActions.LOAD_PAIR,
                payload: {
                    name: pl.name,
                    volume7d: pl.volume7d,
                    volume1d: pl.volume1d,
                    totalReserve0: pl.totalReserve0,
                    totalReserve1: pl.totalReserve1,
                    totalSupply: pl.totalSupply,
                    totalLiquidityUSD: pl.totalLiquidityUSD
                },
            })

            pairTotalReserves[pl.orderedName] = {
                totalReserve0: pl.totalReserve0,
                totalReserve1: pl.totalReserve1,
            }
        }

        //console.log('pairTotalReserves from PairsResponsibility', pairTotalReserves)

        return pairTotalReserves
    }

    const loadPairs = async (): Promise<Record<string, PairTotalReserves>> => {
        try {
            const pairs = Object.values(pairState)
            const infoResultMap = await loadLatestPairsData(pairs)
            const loadPairBalances = await getGeneralPairData(pairs, infoResultMap)

            return await updateGeneralPairData(loadPairBalances)
        } catch (err) {
            return {}
        }
    }

    const loadPairsBalanceUSD = async (pairTotalReserves, updateNotification) => {
        const pairs = Object.values(pairState)
        await loadPairsUSD(pairTotalReserves, pairs, updateNotification)
    }

    const clearUserPairsData = async () => {
        const pairList = Object.keys(pairState).map((x) => pairState[x]);
        for (const pair of pairList) {

            pairDispatch({
                type: PairActions.ADD_ALLOWANCE_TO_PAIR,
                payload: {
                    name: pair.name,
                    allowance: convertBigNumberToUIString(
                      new BigNumber(0)
                    ),
                },
            })

            pairDispatch({
                type: PairActions.ADD_BALANCE_TO_PAIR,
                payload: {
                    name: pair.name,
                    balance: convertBigNumberToUIString(
                      new BigNumber(0)
                    ),
                },
            })
        }
    }

    const getList = (): PairData[] => {
        return Object.entries(pairState).map(([k, v]) => {
            return v;
        });
    };

    const findReservesBySymbols = (symbolA, symbolB, orderedPairState, updateNotification) => pairFinder(pairState, tokenState).findReservesBySymbols(symbolA, symbolB, orderedPairState, updateNotification)

    const calculateUSDtokens = (token0: string, token1: string, amount0: string | number, amount1: string | number): string[] => {
        const filter = getList().filter(
            (r) => r.token0Symbol === token0 && r.token1Symbol === token1
        );
        if (filter.length > 0) {
            return [
                new BigNumber(amount0).times(filter[0].token0Price).toFixed(2),
                new BigNumber(amount1).times(filter[0].token1Price).toFixed(2),
            ];
        }

        const filter2 = getList().filter(
            (r) => r.token1Symbol === token0 && r.token0Symbol === token1
        );
        if (filter2.length > 0) {
            return [
                new BigNumber(amount0).times(filter2[0].token0Price).toFixed(2),
                new BigNumber(amount1).times(filter2[0].token1Price).toFixed(2),
            ];
        }

        return ['0.00', '0.00']
    };

    return {
        loadPairs,
        loadPairsBalanceUSD,
        loadPairsUserData,
        orderedPairState,
        clearUserPairsData,
        getList,
        findReservesBySymbols,
        changeRowPriority,
        calculateUSDtokens
    }
}

export default PairsResponsibilities