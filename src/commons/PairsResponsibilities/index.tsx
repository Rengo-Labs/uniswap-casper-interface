import {getPairData} from "../api/ApolloQueries";
import store from "store2";
import {convertBigNumberToUIString, log} from "../utils";
import BigNumber from "bignumber.js";
import {PairActions, PairState} from "../../reducers/PairsReducer";
import {apiClient} from "../../contexts/ConfigContext";
import {Wallet} from "../wallet";
import TokenResponsibilities from "../TokenResponsibilities";
import {TokenState} from "../../reducers/TokenReducers";
interface PairTotalReserves {
    totalReserve0: BigNumber.Value,
    totalReserve1: BigNumber.Value,
}

const PairsResponsibilities = (pairState: PairState, pairDispatch, tokenState: TokenState) => {

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

    async function loadPairsUSD(pairTotalReserves: Record<string, PairTotalReserves>): Promise<void> {
        try {
            const tokenPrices: Record<string, string> = {}
            const pairs = Object.values(pairState)
            for (const p of pairs) {
                pairDispatch({
                    type: PairActions.LOAD_PAIR_USD,
                    payload: {
                        name: p.name,
                        token0Price: tokenPrices[p.token0Symbol],
                        token1Price: tokenPrices[p.token1Symbol],
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

    const loadLatestPairsData = async () => {
        console.log('loadLatestPairsData from PairsResponsibility')
        const pairs = Object.values(pairState)
        const infoResultMap: Record<string, any> = {}

        try {
            const infoResults = await getPairData(pairs.map(pl => pl.packageHash.substr(5)))
            // infoResults.map(pl => {
            //     infoResultMap[`hash-${pl.id}`] = {...pl}
            // })
            infoResults.map(pl => infoResultMap[`hash-${pl.id}`] = pl)

            console.log('infoResults', infoResults)

            return infoResults
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

    const getGeneralPairData = async (pairs) => {
        console.log('getGeneralPairData from PairsResponsibility')
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

            //TODO Chequear informacion en pares reducer.
            const infoResult = pairs[pl.packageHash] ?? {
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
    }

    const updateGeneralPairData = (results) => {
        console.log('updateGeneralPairData from PairsResponsibility')
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

        console.log('pairTotalReserves from PairsResponsibility', pairTotalReserves)

        return pairTotalReserves
    }

    const loadPairs = async (): Promise<void> => {
        try {
            console.log('Start loadPairs from PairsResponsibility')
            const pairs = await loadLatestPairsData()
            const loadPairBalances = await getGeneralPairData(pairs)
            const pairTotalReserves = updateGeneralPairData(loadPairBalances)
            await loadPairsUSD(pairTotalReserves)
        } catch (err) {
            log.error('loadPairs from PairsResponsibility', err.message);
        }
    }

    return {
        loadPairs,
    }
}

export default PairsResponsibilities
