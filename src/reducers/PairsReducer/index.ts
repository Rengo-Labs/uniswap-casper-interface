import BigNumber from 'bignumber.js'

import csprIcon from "../../assets/swapIcons/casperIcon.png"
import wcsprIcon from "../../assets/swapIcons/wrappedCasperIcon.png"
import csxIcon from "../../assets/swapIcons/coinstoxIcon.png"
import wethIcon from "../../assets/swapIcons/wethIcon.svg"

export type PairData = {
  name: string
  id: string
  balance: string,
  reserve0: string,
  reserve1: string,
  totalReserve0: string,
  totalReserve1: string,
  allowance: string,
  token0Symbol: string,
  token1Symbol: string,
  token0Icon: string,
  token1Icon: string,
  liquidity?: string,
  volume7d?: string,
  fees24h?: string,
  oneYFees?: string,
  volume?: string,
  totalSupply?: string,
  token0Price?: string,
  token1Price?: string,
  liquidityUSD?: string,
  totalLiquidityUSD?: string,
  contract0?: string,
  contract1?: string,
}

export type PairState = Record<string, PairData>

export const initialPairsState: PairState = {
  "WETH-CSX": {
    name: "WETH-CSX",
    id: "c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',  
    token0Icon: wethIcon,
    token1Icon: csxIcon,
    token0Symbol: 'WETH',
    token1Symbol: 'CSX',
  },
  "WCSPR-CSX": {
    name: "WCSPR-CSX",
    id: "a84382872d1402a5ec8d8453f516586166100d8252f997b0bcdeed8c4737588d",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: wcsprIcon,
    token1Icon: csxIcon,
    token0Symbol: 'WCSPR',
    token1Symbol: 'CSX',
  },
  "WETH-WCSPR": {
    name: "WETH-WCSPR",
    id: "cb0f9f291ae73928b739c90c03eca70cd610d945304ea606fe4adced3fa07060",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: wcsprIcon,
    token1Icon: wethIcon,
    token0Symbol: 'WETH',
    token1Symbol: 'WCSPR',
  },
}

export enum PairActions {
  ADD_BALANCE_TO_PAIR = 'ADD_BALANCE_TO_PAIR',
  ADD_ALLOWANCE_TO_PAIR = 'ADD_ALLOWANCE_TO_PAIR',
  LOAD_PAIR = 'LOAD_PAIR',
  LOAD_USER_PAIR = 'LOAD_USER_PAIR',
}

export type PairActionBalancePayload = {
  name: string,
  balance: string,
}

export type PairActionAllowancePayload = {
  name: string,
  allowance: string,
}

export type PairActionLoadPairPayLoad = {
  id: string,
  name: string,
  token0Symbol: string,
  token1Symbol: string,
  totalLiquidityUSD: string,
  volume7d: string,
  fees24h: string,
  oneYFees: string,
  volume: string,
  totalReserve0: string,
  totalReserve1: string,
  totalSupply: string,
  token0Price: string,
  token1Price: string,
  contract0: string,
  contract1: string,
}

export type PairActionLoadUserPairPayLoad = {
  name: string,
  reserve0: string,
  reserve1: string,
  liquidityUSD: string,
}

export type PairAction = {
  type: PairActions.ADD_BALANCE_TO_PAIR,
  payload: PairActionBalancePayload,
} | {
  type: PairActions.ADD_ALLOWANCE_TO_PAIR,
  payload: PairActionAllowancePayload,
} | {
  type: PairActions.LOAD_PAIR,
  payload: PairActionLoadPairPayLoad,
}  | {
  type: PairActions.LOAD_USER_PAIR,
  payload: PairActionLoadUserPairPayLoad,
} 

export function PairsReducer(state: PairState, action: PairAction) {
  switch (action.type) {
    case PairActions.ADD_BALANCE_TO_PAIR:
      return {
        ...state,
        [`${action.payload.name}`]: {
          ...state[`${action.payload.name}`],  
          balance: action.payload.balance,   
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
      case PairActions.LOAD_PAIR:
        return {
          ...state,
          [`${action.payload.name}`]: {
            ...state[`${action.payload.name}`],   
            totalLiquidityUSD: action.payload.totalLiquidityUSD,
            volume7d: action.payload.volume7d,
            fees24h: action.payload.fees24h,
            oneYFees: action.payload.oneYFees,
            volume: action.payload.volume,
            totalReserve0: action.payload.totalReserve0,
            totalReserve1: action.payload.totalReserve1,
            totalSupply: action.payload.totalSupply,
            token0Price: action.payload.token0Price,
            token1Price: action.payload.token1Price,
            contract0: action.payload.contract0,
            contract1: action.payload.contract1,
            id: action.payload.id,
          },
        }
      case PairActions.LOAD_USER_PAIR: 
      return {
        ...state,
        [`${action.payload.name}`]: {
          ...state[`${action.payload.name}`],   
          reserve0: action.payload.reserve0,
          reserve1: action.payload.reserve1,
          liquidityUSD: action.payload.liquidityUSD,
        },
      }
    /*case "GET_PAIRS":
      return { ...state };*/
  }
}
