import { findPairChartData, findDailyGlobalChart, getPairData } from "../api/ApolloQueries";
import store from "store2";
import {convertBigNumberToUIString, log, sleep} from "../utils";
import BigNumber from "bignumber.js";
import { PairActions, PairData, PairState } from "../../reducers/PairsReducer";
import { apiClient, PairReserves } from "../../contexts/ConfigContext";
import { Wallet } from "../wallet";
import { TokenState } from "../../reducers/TokenReducers";
import { pairFinder } from "../pairFinder";
import {ROUTER_PACKAGE_HASH} from "../../constant";

export interface PairTotalReserves {
  token0Symbol: string,
  token1Symbol: string,
  totalReserve0: BigNumber.Value,
  totalReserve1: BigNumber.Value,
}

const PairsResponsibilities = (pairState: PairState, pairDispatch, tokenState?: TokenState) => {
  const orderedPairState = (): Record<string, PairTotalReserves> => {
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

        // console.log('AAA', p.token0Symbol, p.token1Symbol, price0USD, price1USD)

        pairDispatch({
          type: PairActions.LOAD_PAIR_USD,
          payload: {
            name: p.name,
            token0Price: price0USD,
            token1Price: price1USD,
            decimals0: tokenState.tokens[p.token0Symbol].decimals,
            decimals1: tokenState.tokens[p.token1Symbol].decimals,
          },
        })
      }
    } catch (err) {
      log.error('loadPairsUSD - PairsResponsibility', err.message);
    }
  }

  async function loadPairsUserData(wallet: Wallet, isConnected = false): Promise<any> {
    if (!isConnected) {
      return;
    }

    try {
      const ps = [];
      const pairList = Object.keys(pairState).map((x) => pairState[x]);
      const stakingList = new Map()
      for (const pair of pairList) {
        ps.push(
          getAllowanceUpdated(wallet, pair.name, pair.decimals, pair.contractHash, ROUTER_PACKAGE_HASH, PairActions.ADD_ALLOWANCE_TO_PAIR),
          getPairBalance(wallet, pair.name, pair.decimals, pair.contractHash, PairActions.ADD_BALANCE_TO_PAIR,
            tokenState.tokens[pair.token0Symbol].decimals, tokenState.tokens[pair.token1Symbol].decimals)
        )
        if (pair.gaugeContractHash) {
          ps.push(
            getAllowanceUpdated(wallet, pair.name, pair.decimals, pair.contractHash, pair.gaugePackageHash.slice(5), PairActions.ADD_GAUGE_ALLOWANCE_TO_PAIR),
          )
        }
      }

      await Promise.all(ps);
      return stakingList
    } catch (err) {
      log.error('fillPairs - PairsResponsibility', err.message);
      return null
    }
  }

  const loadLatestPairsData = async (pairs) => {
    //console.log('loadLatestPairsData from PairsResponsibility')
    const infoResultMap: Record<string, any> = {}
    try {
      //const infoResults = await getPairData(pairs.map(pl => pl.packageHash.substr(5)))
      //infoResults.map(pl => infoResultMap[`hash-${pl.id}`] = pl)

      return infoResultMap
    } catch (e) {
      console.log(`graphql error - PairsResponsibility: ${e}`)
      return []
    }
  }

  const getGeneralPairData = async (pairs, pairsMap) => {
    //console.log('getGeneralPairData from PairsResponsibility')
    const results = await Promise.all(pairs.map(async (pl) => {

      if (pl.gaugeContractHash) {
        await getTotalGaugeSupply(pl.name, pl.decimals, pl.gaugeContractHash)
        if (pl.gaugeToken) {
          await getTotalRewardAccumulated(pl.name, pl.decimals, tokenState.tokens[pl.gaugeToken].contractHash, pl.gaugeContractHash)
        }
      }

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
        token0Symbol: pl.token0Symbol,
        token1Symbol: pl.token1Symbol,
        totalReserve0: reserve0,
        totalReserve1: reserve1,
        volume7d: new BigNumber(infoResult.oneWeekVolumeUSD).div(10 ** pl.decimals).toFixed(2),
        volume1d: new BigNumber(infoResult.oneDayVolumeUSD).div(10 ** pl.decimals).toFixed(2),
        totalSupply: convertBigNumberToUIString(
          new BigNumber(pairDataResponse.totalSupply),
          pl.decimals
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
          totalSupply: pl.totalSupply
        },
      })

      pairTotalReserves[pl.orderedName] = {
        token0Symbol: pl.token0Symbol,
        token1Symbol: pl.token1Symbol,
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

  const pairsToMap = () => {
    const pairs = Object.values(pairState)
    const pairTotalReserves: Record<string, PairTotalReserves> = {}
    for (const pl of pairs) {
      pairTotalReserves[pl.orderedName] = {
        token0Symbol: pl.token0Symbol,
        token1Symbol: pl.token1Symbol,
        totalReserve0: pl.totalReserve0,
        totalReserve1: pl.totalReserve1,
      }
    }
    return pairTotalReserves
  }

  const clearUserPairsData = async () => {
    const pairList = Object.keys(pairState).map((x) => pairState[x]);
    for (const pair of pairList) {

      pairDispatch({
        type: PairActions.ADD_ALLOWANCE_TO_PAIR,
        payload: {
          name: pair.name,
          allowance: convertBigNumberToUIString(
            new BigNumber(0),
            pair.decimals
          ),
        },
      })

      pairDispatch({
        type: PairActions.ADD_BALANCE_TO_PAIR,
        payload: {
          name: pair.name,
          balance: convertBigNumberToUIString(
            new BigNumber(0),
            pair.decimals
          ),
          decimals0: tokenState.tokens[pair.token0Symbol].decimals,
          decimals1: tokenState.tokens[pair.token1Symbol].decimals
        },
      })

      pairDispatch({
        type: PairActions.CLEAN_LIQUIDITY_USD,
        payload: {
          name: pair.name
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

  const findUSDRateBySymbol = (symbol, updateNotification) => pairFinder(pairState, tokenState).findUSDRateBySymbol(symbol, pairsToMap(), updateNotification)

  const calculateUSDtokens = (token0Price: string, token1Price: string, amount0: string | number, amount1: string | number, isAorB: boolean): string[] => {
    const priceA = new BigNumber(amount0).times(isAorB ? token0Price : token1Price).toFixed(4)
    const priceB = new BigNumber(amount1).times(isAorB ? token1Price : token0Price).toFixed(4)

    return [priceA, priceB]
  }

  const getPairChart = async (pairPackageHash): Promise<any> => {
    //return findPairChartData(pairPackageHash)
  }

  const getGlobalChart = async (): Promise<any> => {
    return findDailyGlobalChart()
  }

  const loadGralRewards = async (tokenUSDPrices, wallet: Wallet): Promise<any> => {

    const pairs = Object.values(pairState)

    let gaugeTotalWeight = 0
    const gaugeCounter = pairs.filter(i => {
      const hasGauge = i.gaugeContractHash != null
      if (hasGauge && i.gaugeCSTWeight) {
        gaugeTotalWeight += i.gaugeCSTWeight
      }
      return hasGauge
    }).length

    await Promise.all(pairs.map(async pl => {

      let balance = '0'
      if (wallet?.isConnected) {
        balance = await getPairBalance(wallet, pl.name, pl.decimals, pl.gaugeContractHash, PairActions.ADD_GAUGE_BALANCE_TO_PAIR)
      }
      const tokenRewardPrice = tokenUSDPrices[pl.gaugeToken] ?? '0'
      const tokenCSTRewardsPrice = tokenUSDPrices['CST'] ?? '0'

      pairDispatch({
        type: PairActions.APR_REWARDS,
        payload: {
          name: pl.name,
          totalLiquidityUSD: pl.totalLiquidityUSD,
          tokenRewardPriceUSD: tokenRewardPrice,
          tokenCSTRewardsPriceUSD: tokenCSTRewardsPrice,
          tokenRewardSymbol: pl.gaugeToken,
          gaugeAmount: gaugeCounter,
          gaugeTotalWeight: gaugeTotalWeight,
          gaugeBalance: balance
        }
      })
    }))

    //return findDailyGlobalChart()
  }

  const getAllowanceUpdated = (wallet: Wallet, name: string, decimals: number, contractHash: string, gaugePackageHash: string, action: string) => {
    apiClient
      .getERC20Allowance(
        wallet,
        contractHash,
        gaugePackageHash
      )
      .then((response) => {
          pairDispatch({
            type: action,
            payload: {
              name: name,
              allowance: convertBigNumberToUIString(
                new BigNumber(response),
                decimals
              ),
            },
          });
      }).catch(e => {
        console.log("failed - allowance", action, name)
        pairDispatch({
          type: action,
          payload: {
            name: name,
            allowance: convertBigNumberToUIString(
              new BigNumber(0),
              decimals
            ),
          },
        })
    })
  }

  const getTotalRewardAccumulated = (name: string, decimals: number, tokenContractHash: string, gaugePackageHash: string) => {
    apiClient
      .getERC20RewardAccumulated(
        gaugePackageHash,
        tokenContractHash
      )
      .then((response) => {
        pairDispatch({
          type: PairActions.LOAD_TOTAL_REWARD_FOR_PAIR,
          payload: {
            name: name,
            totalReward: convertBigNumberToUIString(
              new BigNumber(response),
              decimals
            ),
          },
        });
      }).catch(e => {
      console.log("failed - Accumulated reward", PairActions.LOAD_TOTAL_REWARD_FOR_PAIR, name)
      pairDispatch({
        type: PairActions.LOAD_TOTAL_REWARD_FOR_PAIR,
        payload: {
          name: name,
          totalReward: convertBigNumberToUIString(
            new BigNumber(0),
            decimals
          ),
        },
      })
    })
  }

  const getPairBalance = async (wallet: Wallet, name: string, decimals: number, contractHash: string, action: string, token0Decimal = null, token1Decimal = null): Promise<string> => {
    return apiClient
      .getERC20Balance(
        wallet,
        contractHash,
      )
      .then((response) => {
        pairDispatch({
          type: action,
          payload: {
            name,
            balance: convertBigNumberToUIString(
              new BigNumber(response),
              decimals
            ),
            decimals0: token0Decimal,
            decimals1: token1Decimal
          },
        });
        return convertBigNumberToUIString(
          new BigNumber(response),
          decimals
        )
      }).catch(e => {
      //console.log("Error loading pair balance ", name, e)
      pairDispatch({
        type: action,
        payload: {
          name,
          balance: convertBigNumberToUIString(
            new BigNumber(0),
            decimals
          )
        },
      })
        return '0'
    })
  }

  const getTotalGaugeSupply = async (name: string, decimals: number, contractHash: string): Promise<void> => {
    //
    apiClient
      .getERC20TotalSupply(
        contractHash,
      )
      .then((response: any) => {
        pairDispatch({
          type: PairActions.ADD_GAUGE_TOTAL_STAKE_TO_PAIR,
          payload: {
            name,
            totalStake: convertBigNumberToUIString(
              new BigNumber(response.toNumber()),
              decimals
            ),
          },
        });
      }).catch(e => {
      console.log("Error loading pair gauge total stake ", name, e)
      pairDispatch({
        type: PairActions.ADD_GAUGE_TOTAL_STAKE_TO_PAIR,
        payload: {
          name,
          balance: convertBigNumberToUIString(
            new BigNumber(0),
            decimals
          ),
        },
      })
    })
  }

  return {
    loadPairs,
    loadPairsBalanceUSD,
    loadPairsUserData,
    orderedPairState,
    clearUserPairsData,
    getList,
    findReservesBySymbols,
    changeRowPriority,
    calculateUSDtokens,
    findUSDRateBySymbol,
    getPairChart,
    getGlobalChart,
    loadGralRewards,
    getAllowanceUpdated,
    getPairBalance,
    getTotalRewardAccumulated
  }
}

export default PairsResponsibilities
