import BigNumber from "bignumber.js"
import { convertBigNumberToUIString, convertUIStringToBigNumber } from "../../commons"
import { TOKENS } from '../TokenReducers'

import {pairData} from '../../constant/bootEnvironmet'
import {
  APR_AMOUNT_WEEKS,
  REWARD_CST_WEEKLY_INFLATION_RATE,
  REWARD_TOKEN_WEEKLY_EMISSIONS
} from "../../constant";

export type PairData = {
  checked: boolean,
  name: string
  orderedName?: string
  contractHash: string
  packageHash: string
  balance: string,
  reserve0: string,
  reserve1: string,
  totalReserve0: string,
  totalReserve1: string,
  allowance: string,
  token0Symbol: string,
  token1Symbol: string,
  token0Icon?: string,
  token1Icon?: string,
  liquidity?: string,
  volume7d?: string,
  volume1d?: string,
  apr?: string,
  totalSupply?: string,
  token0Price?: string,
  token1Price?: string,
  liquidityUSD?: string,
  totalLiquidityUSD?: string,
  contract0?: string,
  contract1?: string,
  token0Name?: string,
  token1Name?: string,
  decimals: number,
  gaugeBalance?: string,
  gaugeTotalStake?: string,
  gaugeTotalStakeUSD?: string,
  gaugeAllowance?: string,
  gaugeContractHash?: string,
  gaugePackageHash?: string,
  gaugeToken?: string,
  gaugeCSTRewards?: boolean,
  gaugeCSTWeight?: number,
  userApr?: string,
  totalReward?: string
}

export type PairState = Record<string, PairData>

const RAW_PAIRS = pairData
export const PAIRS: PairState = {}

Object.values(RAW_PAIRS).map((p) => {
  const pair = Object.assign({}, p)

  pair.token0Name = TOKENS[p.token0Symbol].name
  pair.token1Name = TOKENS[p.token1Symbol].name
  pair.token0Icon = TOKENS[p.token0Symbol].logoURI
  pair.token1Icon = TOKENS[p.token1Symbol].logoURI
  pair.contract0 = TOKENS[p.token0Symbol].packageHash
  pair.contract1 = TOKENS[p.token1Symbol].packageHash

  // sort pair by alphanumeric order
  if (pair.contract0.localeCompare(pair.contract1) > 0) {
    const nameTemp = pair.token0Name
    pair.token0Name = pair.token1Name
    pair.token1Name = nameTemp

    const iconTemp = pair.token0Icon
    pair.token0Icon = pair.token1Icon
    pair.token1Icon = iconTemp

    const contractTemp = pair.contract0
    pair.contract0 = pair.contract1
    pair.contract1 = contractTemp

    const symbolTemp = pair.token0Symbol
    pair.token0Symbol = pair.token1Symbol
    pair.token1Symbol = symbolTemp
  }

  pair.orderedName = `${pair.token0Symbol}-${pair.token1Symbol}`

  PAIRS[p.name] = pair
})
export const initialPairsState: PairState = PAIRS

export enum PairActions {
  ADD_BALANCE_TO_PAIR = 'ADD_BALANCE_TO_PAIR',
  ADD_ALLOWANCE_TO_PAIR = 'ADD_ALLOWANCE_TO_PAIR',
  ADD_GAUGE_BALANCE_TO_PAIR = 'ADD_GAUGE_BALANCE_TO_PAIR',
  ADD_GAUGE_ALLOWANCE_TO_PAIR = 'ADD_GAUGE_ALLOWANCE_TO_PAIR',
  LOAD_PAIR = 'LOAD_PAIR',
  LOAD_PAIR_USD = 'LOAD_PAIR_USD',
  CLEAN_LIQUIDITY_USD = 'CLEAN_LIQUIDITY_USD',
  CHANGE_PRIORITY = 'CHANGE_PRIORITY',
  //LOAD_USER_PAIR = 'LOAD_USER_PAIR',
  ADD_GAUGE_TOTAL_STAKE_TO_PAIR = 'ADD_GAUGE_TOTAL_STAKE_TO_PAIR',
  RESET = 'RESET',
  APR_REWARDS = 'APR_REWARDS',
  LOAD_TOTAL_REWARD_FOR_PAIR = 'LOAD_TOTAL_REWARD_FOR_PAIR',
}

export type PairActionBalancePayload = {
  name: string,
  balance: string,
  decimals0: number,
  decimals1: number
}

export type PairActionAllowancePayload = {
  name: string,
  allowance: string,
}

export type PairActionTotalRewardPayload = {
  name: string,
  totalReward: string,
}

export type PairActionGaugeBalancePayload = {
  name: string,
  balance: string,
}

export type PairActionGaugeAllowancePayload = {
  name: string,
  allowance: string,
}

export type PairActionGaugeTotalStakePayload = {
  name: string,
  totalStake: string,
}

export type PairActionLoadPairPayLoad = {
  name: string,
  volume7d: string,
  volume1d: string,
  totalReserve0: string,
  totalReserve1: string,
  totalSupply: string
}

export type PairActionLoadAPRRewardPayLoad = {
  name: string,
  tokenRewardPriceUSD: string,
  tokenCSTRewardsPriceUSD: string,
  tokenRewardSymbol: string,
  totalLiquidityUSD: string,
  gaugeAmount: number,
  gaugeTotalWeight: number,
  gaugeBalance: string,
  gaugeTotalStakeUSD: string
}

export type PairActionLoadPairUSDPayLoad = {
  name: string,
  token0Price: string,
  token1Price: string,
  isWalletConnected: boolean,
  decimals0: number,
  decimals1: number
}

export type PairActionCleanLiquidityUSDPayLoad = {
  name: string,
  liquidityUSD: string
}

export type PairActionChangePriorityPayLoad = {
  name: string,
  checked: boolean,
}

export type PairActionLoadUserPairPayLoad = {
  name: string,
  reserve0: string,
  reserve1: string,
  liquidityUSD: string,
  decimals0: number,
  decimals1: number
}

export type PairAction = {
  type: PairActions.ADD_BALANCE_TO_PAIR,
  payload: PairActionBalancePayload,
} | {
  type: PairActions.ADD_ALLOWANCE_TO_PAIR,
  payload: PairActionAllowancePayload,
} | {
  type: PairActions.ADD_GAUGE_BALANCE_TO_PAIR,
  payload: PairActionGaugeBalancePayload,
} | {
  type: PairActions.ADD_GAUGE_ALLOWANCE_TO_PAIR,
  payload: PairActionGaugeAllowancePayload,
} | {
  type: PairActions.ADD_GAUGE_TOTAL_STAKE_TO_PAIR,
  payload: PairActionGaugeTotalStakePayload,
} | {
  type: PairActions.LOAD_PAIR,
  payload: PairActionLoadPairPayLoad,
} | {
  type: PairActions.APR_REWARDS,
  payload: PairActionLoadAPRRewardPayLoad,
} | {
  type: PairActions.LOAD_TOTAL_REWARD_FOR_PAIR,
  payload: PairActionTotalRewardPayload,
} | {
  type: PairActions.LOAD_PAIR_USD,
  payload: PairActionLoadPairUSDPayLoad,
} | {
  type: PairActions.CLEAN_LIQUIDITY_USD,
  payload: PairActionCleanLiquidityUSDPayLoad,
} | {
  type: PairActions.CHANGE_PRIORITY,
  payload: PairActionChangePriorityPayLoad,
}/* | {
  type: PairActions.LOAD_USER_PAIR,
  payload: PairActionLoadUserPairPayLoad,
}*/ | {
  type: PairActions.RESET,
}

export function PairsReducer(state: PairState, action: PairAction): PairState {
  switch (action.type) {
    case PairActions.ADD_BALANCE_TO_PAIR:
      {
        const oldState = state[`${action.payload.name}`]
        if (!oldState) {
          throw new Error(`pair ${action.payload.name} does not exist`)
        }

        const balance = convertUIStringToBigNumber(action.payload.balance, oldState.decimals)
        const totalSupply = convertUIStringToBigNumber(oldState.totalSupply, oldState.decimals)
        const totalReserve0 = convertUIStringToBigNumber(oldState.totalReserve0, action.payload.decimals0)
        const totalReserve1 = convertUIStringToBigNumber(oldState.totalReserve1, action.payload.decimals1)
        const reserve0 = convertBigNumberToUIString(new BigNumber(totalReserve0.times(balance.div(totalSupply)).toFixed(0)), action.payload.decimals0)
        const reserve1 = convertBigNumberToUIString(new BigNumber(totalReserve1.times(balance.div(totalSupply)).toFixed(0)), action.payload.decimals1)

        return {
          ...state,
          [`${action.payload.name}`]: {
            ...oldState,
            balance: convertBigNumberToUIString(balance, oldState.decimals),
            reserve0,
            reserve1,
          },
        }
      }
    case PairActions.ADD_GAUGE_BALANCE_TO_PAIR:
      let gaugeBalance = '0'
      const oldState = state[`${action.payload.name}`]
      if (oldState.gaugeToken != null && oldState.gaugeCSTRewards) {
        gaugeBalance = action.payload.balance
      }
      return {
        ...state,
        [`${action.payload.name}`]: {
          ...state[`${action.payload.name}`],
          gaugeBalance: action.payload.balance,
        },
      }
    case PairActions.ADD_ALLOWANCE_TO_PAIR:
      return {
        ...state,
        [`${action.payload.name}`]: {
          ...state[`${action.payload.name}`],
          allowance: action.payload.allowance,
        },
      }
    case PairActions.ADD_GAUGE_ALLOWANCE_TO_PAIR:
      return {
        ...state,
        [`${action.payload.name}`]: {
          ...state[`${action.payload.name}`],
          gaugeAllowance: action.payload.allowance,
        },
      }
    case PairActions.ADD_GAUGE_TOTAL_STAKE_TO_PAIR:
      return {
        ...state,
        [`${action.payload.name}`]: {
          ...state[`${action.payload.name}`],
          gaugeTotalStake: action.payload.totalStake,
        },
      }
    case PairActions.LOAD_PAIR:
      {
        const oldState = state[`${action.payload.name}`]

        return {
          ...state,
          [`${action.payload.name}`]: {
            ...oldState,
            volume7d: action.payload.volume7d,
            volume1d: action.payload.volume1d,
            //reserve0,
            //reserve1,
            totalReserve0: action.payload.totalReserve0,//convertBigNumberToUIString(totalReserve0, action.payload.decimals0),
            totalReserve1: action.payload.totalReserve1,//convertBigNumberToUIString(totalReserve1, action.payload.decimals1),
            totalSupply: action.payload.totalSupply//convertBigNumberToUIString(totalSupply, oldState.decimals),
          },
        }
      }
    case PairActions.LOAD_PAIR_USD:
      {
        const oldState = state[`${action.payload.name}`]

        const liquidityUSD = new BigNumber(oldState.reserve0)
          .times(action.payload.token0Price)
          .plus(
            new BigNumber(oldState.reserve1)
              .times(action.payload.token1Price)
          )
          .toString()
        const totalLiquidityUSD = new BigNumber(oldState.totalReserve0)
          .times(action.payload.token0Price)
          .plus(
            new BigNumber(oldState.totalReserve1)
              .times(action.payload.token1Price)
          )
          .toString()

        return {
          ...state,
          [`${action.payload.name}`]: {
            ...oldState,
            liquidityUSD,
            totalLiquidityUSD,
            token0Price: action.payload.token0Price,
            token1Price: action.payload.token1Price,
          },
        }
      }
    case PairActions.CLEAN_LIQUIDITY_USD:
      {
        const oldState = state[`${action.payload.name}`]

        return {
          ...state,
          [`${action.payload.name}`]: {
            ...oldState,
            liquidityUSD: "0"
          },
        }
      }
    case PairActions.CHANGE_PRIORITY:
      {
        const oldState = state[`${action.payload.name}`]

        return {
          ...state,
          [`${action.payload.name}`]: {
            ...oldState,
            checked: action.payload.checked
          }
        }
      }
    case PairActions.RESET: {
      return initialPairsState
    }
    case PairActions.APR_REWARDS: {
      const oldState = state[`${action.payload.name}`]

      let apr = 0
      let userAPR = 0
      let totalStakeUSD = BigNumber(0)
      if (!!action.payload.tokenRewardPriceUSD && oldState.gaugeContractHash) {
        const pricePerLPToken = new BigNumber(action.payload.totalLiquidityUSD)
          .div(oldState.totalSupply)

        totalStakeUSD = new BigNumber(oldState.gaugeTotalStake)
          .times(pricePerLPToken)

        //console.log("----------------")
        //console.log("total liquidity usd", action.payload.totalLiquidityUSD, "/", oldState.totalSupply, "->", pricePerLPToken.toString())
        //console.log("total staked", oldState.gaugeTotalStake, "price per LP Token", pricePerLPToken, "->", totalStakeUSD.toString())

        const percentStake = new BigNumber(action.payload.gaugeBalance)
          .div(oldState.gaugeTotalStake)

        //console.log("percent stake", action.payload.gaugeBalance, "/", oldState.gaugeTotalStake)
        //console.log("----------------")

        if (oldState.gaugeToken != null) {
          const rewardPriceXWeekly = new BigNumber(action.payload.tokenRewardPriceUSD)
            .times(REWARD_TOKEN_WEEKLY_EMISSIONS)
            .times(oldState.gaugeCSTWeight)
            .div(action.payload.gaugeTotalWeight)
          // (ETH price usd * ETH gauge weight) / (total number of gauge * eth weekly)  / total supply usd
          const yearlyWeightedReward = rewardPriceXWeekly
            .times(APR_AMOUNT_WEEKS)
            .div(action.payload.gaugeAmount)

          const globalRewardsAPR = parseFloat(action.payload.totalLiquidityUSD) == 0 ? BigNumber(0) : yearlyWeightedReward
            .div(action.payload.totalLiquidityUSD)
            .times(100)

          const userRewardsAPR = yearlyWeightedReward
            .div(totalStakeUSD)
            .times(100)
            .times(percentStake)

          //console.log("---------------- BEGIN - APR Gauge Reward -------")
          //console.log("Token Reward Price USD:", action.payload.tokenRewardPriceUSD, "Reward token weekly emission", REWARD_TOKEN_WEEKLY_EMISSIONS)
          //console.log("Amount of Gauges:", action.payload.gaugeAmount, "APR AMOUNT WEEKS", APR_AMOUNT_WEEKS)
          //console.log("APR -> (", APR_AMOUNT_WEEKS, "/", action.payload.gaugeAmount, ")/", action.payload.totalLiquidityUSD, "* 100 =", globalRewardsAPR.toString())
          //console.log("---------------- END - APR Gauge Reward ---------")
          apr += (globalRewardsAPR.isNaN() || parseFloat(action.payload.totalLiquidityUSD) == 0) ? 0 : globalRewardsAPR.toNumber()
          userAPR += userRewardsAPR.isNaN() ? 0 : userRewardsAPR.toNumber()
        }

        if (oldState.gaugeCSTRewards) {
          const rewardPriceXWeekly = new BigNumber(action.payload.tokenCSTRewardsPriceUSD)
            .times(REWARD_CST_WEEKLY_INFLATION_RATE).div(action.payload.gaugeAmount)
          // (CST price usd * CST Yearly * cst gauge weight) / total gauge weight / total supply usd
          const yearlyWeightedReward = rewardPriceXWeekly
            .times(APR_AMOUNT_WEEKS)
            .times(oldState.gaugeCSTWeight)
            .div(action.payload.gaugeTotalWeight)

          const globalRewardsAPR = parseFloat(action.payload.totalLiquidityUSD) == 0 ? BigNumber(0) : yearlyWeightedReward
            .div(action.payload.totalLiquidityUSD)
            .times(100)

          const userRewardsAPR = yearlyWeightedReward
            .div(totalStakeUSD)
            .times(100)
            .times(percentStake)
          //console.log("---------------- BEGIN - APR CST REWARD -------------")
          //console.log("Token CST Rewards Price USD:", action.payload.tokenCSTRewardsPriceUSD, "Reward CST Weekly inflation rate", REWARD_CST_WEEKLY_INFLATION_RATE, "Amount of gauges", action.payload.gaugeAmount)
          //console.log("Gauge Total Weight:", action.payload.gaugeTotalWeight, "Gauge CST Weight", oldState.gaugeCSTWeight)
          //console.log("Reward Price Weekly: (", action.payload.tokenCSTRewardsPriceUSD, "*", REWARD_CST_WEEKLY_INFLATION_RATE, ") /", action.payload.gaugeAmount, "=", rewardPriceXWeekly.toString())
          //console.log("APR -> ", APR_AMOUNT_WEEKS, "*", oldState.gaugeCSTWeight, "/", action.payload.gaugeTotalWeight, "=", globalRewardsAPR.toString())
          //console.log("---------------- END - APR CST REWARD ---------------")

          apr += globalRewardsAPR.isNaN() ? 0 : globalRewardsAPR.toNumber()
          userAPR += userRewardsAPR.isNaN() ? 0 : userRewardsAPR.toNumber()
        }
      }

      return {
        ...state,
        [`${action.payload.name}`]: {
          ...oldState,
          apr: `${apr.toFixed(2)}`,
          userApr: `${userAPR.toFixed(2)}`,
          gaugeTotalStakeUSD: totalStakeUSD.toFixed(2)
        },
      }
    }

    case PairActions.LOAD_TOTAL_REWARD_FOR_PAIR: {
      return {
        ...state,
        [`${action.payload.name}`]: {
          ...state[`${action.payload.name}`],
          totalReward: action.payload.totalReward,
        },
      }
    }

    default:
      return state;
    /* case PairActions.LOAD_USER_PAIR:
      return {
        ...state,
        [`${action.payload.name}`]: {
          ...state[`${action.payload.name}`],
          reserve0: action.payload.reserve0,
          reserve1: action.payload.reserve1,
          liquidityUSD: action.payload.liquidityUSD,
        },
      } */
    /*case "GET_PAIRS":
      return { ...state };*/
  }
}
