import wcsprIcon from "../../assets/swapIcons/wrappedCasperIcon.png"
import csxIcon from "../../assets/swapIcons/coinstoxIcon.png"
import wethIcon from "../../assets/swapIcons/wethIcon.svg"
import { convertBigNumberToUIString, convertUIStringToBigNumber } from "../../commons"

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
  token0Name?: string,
  token1Name?: string,
}

export type PairState = Record<string, PairData>

export const initialPairsState: PairState = {
  "CSX-WETH": {
    name: "CSX-WETH",
    id: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: csxIcon,
    token1Icon: wethIcon,
    token0Symbol: 'CSX',
    token1Symbol: 'WETH',
    token0Name: 'Wrapper Ether',
    token1Name: 'Coinstox',
    liquidity: '0',
    volume7d: '0',
    fees24h: '0',
    oneYFees: '0',
    volume: '0',
    totalSupply: '0',
    token0Price: '0',
    token1Price: '0',
    liquidityUSD: '0',
    totalLiquidityUSD: '0',
    contract0: '',
    contract1: '',
  },
  "CSX-WCSPR": {
    name: "CSX-WCSPR",
    id: "hash-9b4f66939ce96621b5f60386f57ae8c4c8f998e4156caf6e5b8bea987756e7d3",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: csxIcon,
    token1Icon: wcsprIcon,
    token0Symbol: 'CSX',
    token1Symbol: 'WCSPR',
    token0Name: 'Wrapper Casper',
    token1Name: 'Coinstox',
    liquidity: '0',
    volume7d: '0',
    fees24h: '0',
    oneYFees: '0',
    volume: '0',
    totalSupply: '0',
    token0Price: '0',
    token1Price: '0',
    liquidityUSD: '0',
    totalLiquidityUSD: '0',
    contract0: '',
    contract1: '',
  },
  "WETH-WCSPR": {
    name: "WETH-WCSPR",
    id: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8dd",
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
    token0Name: 'Wrapper Ether',
    token1Name: 'Wrapper Casper',
    liquidity: '0',
    volume7d: '0',
    fees24h: '0',
    oneYFees: '0',
    volume: '0',
    totalSupply: '0',
    token0Price: '0',
    token1Price: '0',
    liquidityUSD: '0',
    totalLiquidityUSD: '0',
    contract0: '',
    contract1: '',
  },
}

export enum PairActions {
  ADD_BALANCE_TO_PAIR = 'ADD_BALANCE_TO_PAIR',
  ADD_ALLOWANCE_TO_PAIR = 'ADD_ALLOWANCE_TO_PAIR',
  LOAD_PAIR = 'LOAD_PAIR',
  //LOAD_USER_PAIR = 'LOAD_USER_PAIR',
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
  token0Name?: string,
  token1Name?: string
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
}/* | {
  type: PairActions.LOAD_USER_PAIR,
  payload: PairActionLoadUserPairPayLoad,
}*/

export function PairsReducer(state: PairState, action: PairAction): PairState {
  switch (action.type) {
    case PairActions.ADD_BALANCE_TO_PAIR:
      {
        const oldState = state[`${action.payload.name}`]
        if (!oldState) {
          throw new Error(`pair ${action.payload.name} does not exist`)
        }

        const balance = convertUIStringToBigNumber(action.payload.balance)
        const totalSupply = convertUIStringToBigNumber(oldState.totalSupply)
        const totalReserve0 = convertUIStringToBigNumber(oldState.totalReserve0)
        const totalReserve1 = convertUIStringToBigNumber(oldState.totalReserve1)
        const reserve0 = convertBigNumberToUIString(totalReserve0.times(balance.div(totalSupply)))
        const reserve1 = convertBigNumberToUIString(totalReserve1.times(balance.div(totalSupply)))

        return {
          ...state,
          [`${action.payload.name}`]: {
            ...oldState,
            balance: convertBigNumberToUIString(balance),
            reserve0,
            reserve1,
          },
        }
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
      {
        const oldState = state[`${action.payload.name}`]

        const balance = convertUIStringToBigNumber(oldState.balance)
        const totalSupply = convertUIStringToBigNumber(action.payload.totalSupply)
        const totalReserve0 = convertUIStringToBigNumber(action.payload.totalReserve0)
        const totalReserve1 = convertUIStringToBigNumber(action.payload.totalReserve1)
        const reserve0 = convertBigNumberToUIString(totalReserve0.times(balance.div(totalSupply)))
        const reserve1 = convertBigNumberToUIString(totalReserve1.times(balance.div(totalSupply)))

        return {
          ...state,
          [`${action.payload.name}`]: {
            ...oldState,
            totalLiquidityUSD: action.payload.totalLiquidityUSD,
            volume7d: action.payload.volume7d,
            fees24h: action.payload.fees24h,
            oneYFees: action.payload.oneYFees,
            volume: action.payload.volume,
            reserve0,
            reserve1,
            totalReserve0: convertBigNumberToUIString(totalReserve0),
            totalReserve1: convertBigNumberToUIString(totalReserve1),
            totalSupply: convertBigNumberToUIString(totalSupply),
            token0Price: action.payload.token0Price,
            token1Price: action.payload.token1Price,
            contract0: action.payload.contract0,
            contract1: action.payload.contract1,
            token0Name: action.payload.token0Name,
            token1Name: action.payload.token1Name,
            id: action.payload.id,
          },
        }
      }
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
