import {getPairData} from "../api/ApolloQueries";
import store from "store2";
import {convertBigNumberToUIString, convertUIStringToBigNumber, log} from "../utils";
import BigNumber from "bignumber.js";
import {PairActions, PairData, PairState} from "../../reducers/PairsReducer";
import {apiClient, PairReserves} from "../../contexts/ConfigContext";
import {Wallet} from "../wallet";
import {TokenActions, TokenState} from "../../reducers/TokenReducers";

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

    async function loadPairsUSD(pairTotalReserves: Record<string, PairTotalReserves>, pairs): Promise<void> {
        try {
            for (const p of pairs) {
                const price0USD = findUSDRateBySymbol(p.token0Symbol, pairTotalReserves).toString()
                const price1USD = findUSDRateBySymbol(p.token1Symbol, pairTotalReserves).toString()

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
        console.log('loadLatestPairsData from PairsResponsibility')
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

    const loadPairs = async (): Promise<Record<string, PairTotalReserves>> => {
        try {
            console.log('Start loadPairs from PairsResponsibility')
            const pairs = Object.values(pairState)
            const infoResultMap = await loadLatestPairsData(pairs)
            const loadPairBalances = await getGeneralPairData(pairs, infoResultMap)

            return await updateGeneralPairData(loadPairBalances)
        } catch (err) {
            log.error('loadPairs from PairsResponsibility', err.message);
            return {}
        }
    }

    const loadPairsBalanceUSD = async (pairTotalReserves) => {
        const pairs = Object.values(pairState)
        await loadPairsUSD(pairTotalReserves, pairs)
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

    /**
     * findReservesBySymbols search for pair data by the symbol pair
     *
     * @param tokenSymbol token symbol string
     *
     * @returns usd conversion rate
     */
    const findUSDRateBySymbol = (
      tokenSymbol: string,
      pairTotalReserves: Record<string, PairTotalReserves>,
    ): BigNumber => {
        let t = tokenSymbol
        if (t === 'CSPR') {
            t = 'WCSPR'
        }

        if (t === 'USDC') {
            const ratesUSDC = findReservesBySymbols(t, 'USDT', pairTotalReserves)

            return new BigNumber(ratesUSDC.reserve0).div(ratesUSDC.reserve1).plus(1).div(2)
        }

        if (t === 'USDT') {
            const ratesUSDT = findReservesBySymbols(t, 'USDC', pairTotalReserves)

            return new BigNumber(ratesUSDT.reserve0).div(ratesUSDT.reserve1).plus(1).div(2)
        }

        const ratesUSDC = findReservesBySymbols(t, 'USDC', pairTotalReserves)
        const ratesUSDT = findReservesBySymbols(t, 'USDT', pairTotalReserves)

        // console.log('ratesUSDC/T', ratesUSDC.reserve0.toString(), ratesUSDT.reserve0.toString())

        if (ratesUSDC.reserve0.toString() === '0' || ratesUSDT.reserve0.toString() === '0') {
            return new BigNumber(0)
        }

        console.log(ratesUSDC.reserve0.toString(), ratesUSDC.reserve1.toString(), ratesUSDT.reserve0.toString(), ratesUSDT.reserve1.toString())
        return new BigNumber(ratesUSDC.reserve1).div(ratesUSDC.reserve0).plus(BigNumber(ratesUSDT.reserve1).div(ratesUSDT.reserve0)).div(2)
    }

    /**
     * findReservesBySymbols search for pair data by the symbol pair
     *
     * @param tokenASymbol first token symbol string
     * @param tokenBSymbol second token symbol string
     *
     * @returns pair reserve data
     */
    const findReservesBySymbols = (
      tokenASymbol: string,
      tokenBSymbol: string,
      overrideReserves: Record<string, PairTotalReserves> = {},
    ): PairReserves | undefined => {
        let tA = tokenASymbol
        let tB = tokenBSymbol
        if (tA === 'CSPR') {
            tA = 'WCSPR'
        }
        if (tB === 'CSPR') {
            tB = 'WCSPR'
        }

        const lookUp = `${tA}-${tB}`

        // do a simple look up
        const pairData = overrideReserves[lookUp] ?? orderedPairState()[lookUp]

        if (pairData) {
            return {
                reserve0: convertUIStringToBigNumber(pairData.totalReserve0),
                reserve1: convertUIStringToBigNumber(pairData.totalReserve1),
            }
        }
    }

    const getPoolList = (): PairData[] => {
        return Object.entries(pairState).map(([k, v]) => {
            return v;
        });
    };

    return {
        loadPairs,
        loadPairsBalanceUSD,
        loadPairsUserData,
        orderedPairState,
        clearUserPairsData,
        getPoolList,
    }
}

export default PairsResponsibilities
