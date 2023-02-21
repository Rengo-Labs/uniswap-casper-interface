import BigNumber from "bignumber.js"
import { convertBigNumberToUIString, convertUIStringToBigNumber } from "../../commons"
import { TOKENS } from '../TokenReducers'

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
  totalSupply?: string,
  token0Price?: string,
  token1Price?: string,
  liquidityUSD?: string,
  totalLiquidityUSD?: string,
  contract0?: string,
  contract1?: string,
  token0Name?: string,
  token1Name?: string,
  decimals: number
}

export type PairState = Record<string, PairData>

const RAW_PAIRS: PairState = {
  /*"CST-WETH": {
    name: "CST-WETH",
    contractHash: "hash-c4350dd69eea06fe6d579919c91d3aaa1d7dcdec9ba533ddc05658cef5875cc0",
    packageHash: "hash-dc13b188563da4a1afa67b441e77d045db8a71dba678b832dfb40b420d85bcd2",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Symbol: 'CST',
    token1Symbol: 'WETH',
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
    decimals: 9,
  },*/
  "CST-WCSPR": {
    checked: false,
    name: "CST-WCSPR",
    orderedName: '',
    contractHash: "hash-c4350dd69eea06fe6d579919c91d3aaa1d7dcdec9ba533ddc05658cef5875cc0",
    packageHash: "hash-dc13b188563da4a1afa67b441e77d045db8a71dba678b832dfb40b420d85bcd2",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Symbol: 'CST',
    token1Symbol: 'WCSPR',
    liquidity: '0',
    volume7d: '0',
    volume1d: '0',
    totalSupply: '0',
    token0Price: '0',
    token1Price: '0',
    liquidityUSD: '0',
    totalLiquidityUSD: '0',
    decimals: 9,
  },
  "WBTC-WCSPR": {
    checked: false,
    name: "WBTC-WCSPR",
    orderedName: '',
    contractHash: "hash-40edc05caa0cafa9eb0e954188a4b08b22334eaea36635bece2e99b88437c2d1",
    packageHash: "hash-a5a9a804a383f3b0e131c85d471542af2c6d4ec57bab39182ba93dd7bd86f46c",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Symbol: 'WCSPR',
    token1Symbol: 'WBTC',
    liquidity: '0',
    volume7d: '0',
    volume1d: '0',
    totalSupply: '0',
    token0Price: '0',
    token1Price: '0',
    liquidityUSD: '0',
    totalLiquidityUSD: '0',
    decimals: 9,
  },
  "WETH-WCSPR": {
    checked: false,
    name: "WETH-WCSPR",
    contractHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8dd",
    packageHash: "hash-a3f3a7c26a0723f56ad74dcb4d9a86642d1d53c6d1add00c237df5199a3025e6",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Symbol: 'WCSPR',
    token1Symbol: 'WETH',
    liquidity: '0',
    volume7d: '0',
    volume1d: '0',
    totalSupply: '0',
    token0Price: '0',
    token1Price: '0',
    liquidityUSD: '0',
    totalLiquidityUSD: '0',
    decimals: 9,
  },
  "USDT-WCSPR": {
    checked: false,
    name: "USDT-WCSPR",
    orderedName: '',
    contractHash: "hash-17277427f5bc536313f1e8b536d9bb6ab87ff13583402679b582d9b6b1774aaf",
    packageHash: "hash-800dee0fb5abf6d3525f520a4b052d8d36edb985a748a671209745c80836c2af",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Symbol: 'WCSPR',
    token1Symbol: 'USDT',
    liquidity: '0',
    volume7d: '0',
    volume1d: '0',
    totalSupply: '0',
    token0Price: '0',
    token1Price: '0',
    liquidityUSD: '0',
    totalLiquidityUSD: '0',
    decimals: 9,
  },
  "USDC-WCSPR": {
    checked: false,
    name: "USDC-WCSPR",
    orderedName: '',
    contractHash: "hash-b080106ba9a0838173c4a41b29220deae768d0614bfbebfe653ca8a52a0bc23d",
    packageHash: "hash-cf56e334481fe2bf0530e0c03a586d2672da8bfe1d1d259ea91457a3bd8971e0",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Symbol: 'WCSPR',
    token1Symbol: 'USDC',
    liquidity: '0',
    volume7d: '0',
    volume1d: '0',
    totalSupply: '0',
    token0Price: '0',
    token1Price: '0',
    liquidityUSD: '0',
    totalLiquidityUSD: '0',
    decimals: 9,
  },
  "USDT-USDC": {
    checked: false,
    name: "USDT-USDC",
    orderedName: '',
    contractHash: "hash-ffed0f843fe60f120da664a9a8522544c97a762fe37422d2f0476adc871b7da9",
    packageHash: "hash-6de9a63441e43d75e8774675407ed3d6775b0e5f3fa35382c744980733030902",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Symbol: 'USDC',
    token1Symbol: 'USDT',
    liquidity: '0',
    volume7d: '0',
    volume1d: '0',
    totalSupply: '0',
    token0Price: '0',
    token1Price: '0',
    liquidityUSD: '0',
    totalLiquidityUSD: '0',
    decimals: 9,
  },
}

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

// TODO ESTO SE VA PARA PAIR CONTEXT
export const initialPairsState: PairState = PAIRS

export enum PairActions {
  ADD_BALANCE_TO_PAIR = 'ADD_BALANCE_TO_PAIR',
  ADD_ALLOWANCE_TO_PAIR = 'ADD_ALLOWANCE_TO_PAIR',
  LOAD_PAIR = 'LOAD_PAIR',
  LOAD_PAIR_USD = 'LOAD_PAIR_USD',
  CHANGE_PRIORITY = 'CHANGE_PRIORITY'
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
  name: string,
  volume7d: string,
  volume1d: string,
  totalReserve0: string,
  totalReserve1: string,
  totalSupply: string,
  totalLiquidityUSD: string
}

export type PairActionLoadPairUSDPayLoad = {
  name: string,
  token0Price: string,
  token1Price: string,
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
} | {
  type: PairActions.LOAD_PAIR_USD,
  payload: PairActionLoadPairUSDPayLoad,
} | {
  type: PairActions.CHANGE_PRIORITY,
  payload: PairActionChangePriorityPayLoad,
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

        //const balance = convertUIStringToBigNumber(oldState.balance)
        const totalSupply = convertUIStringToBigNumber(action.payload.totalSupply)
        const totalReserve0 = convertUIStringToBigNumber(action.payload.totalReserve0)
        const totalReserve1 = convertUIStringToBigNumber(action.payload.totalReserve1)
        //const reserve0 = convertBigNumberToUIString(totalReserve0.times(balance.div(totalSupply)))
        //const reserve1 = convertBigNumberToUIString(totalReserve1.times(balance.div(totalSupply)))

        return {
          ...state,
          [`${action.payload.name}`]: {
            ...oldState,
            volume7d: action.payload.volume7d,
            volume1d: action.payload.volume1d,
            //reserve0,
            //reserve1,
            totalLiquidityUSD: action.payload.totalLiquidityUSD,
            totalReserve0: convertBigNumberToUIString(totalReserve0),
            totalReserve1: convertBigNumberToUIString(totalReserve1),
            totalSupply: convertBigNumberToUIString(totalSupply),
          },
        }
      }
    case PairActions.LOAD_PAIR_USD:
      {
        const oldState = state[`${action.payload.name}`]

        const liquidityUSD = new BigNumber(convertUIStringToBigNumber(oldState.reserve0))
          .times(action.payload.token0Price)
          .plus(new BigNumber(convertUIStringToBigNumber(oldState.reserve1)).times(action.payload.token1Price))
          .div(10 ** 9)
          .toString()
        // console.log('action.payload', action.payload, oldState.totalReserve0, oldState.totalReserve1)

        return {
          ...state,
          [`${action.payload.name}`]: {
            ...oldState,
            liquidityUSD,
            token0Price: action.payload.token0Price,
            token1Price: action.payload.token1Price,
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
