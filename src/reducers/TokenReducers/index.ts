import csprIcon from "../../assets/swapIcons/casperIcon.png"
import wcsprIcon from "../../assets/swapIcons/wrappedCasperIcon.png"
import cstIcon from "../../assets/swapIcons/casperswap.png"
import wethIcon from "../../assets/swapIcons/wethIcon.svg"
import wbtcIcon from "../../assets/swapIcons/btc.png"
import usdtIcon from "../../assets/swapIcons/tether.png"
import usdcIcon from "../../assets/swapIcons/usdc.png"
import dwbtc from "../../assets/swapIcons/dwbtc.png"

import { Token } from '../../commons/api'

export interface TokenState {
  tokens: Record<string, Token>,
  firstTokenSelected: string,
  secondTokenSelected: string,
}

const RAW_TOKENS: Record<string, Token> = {
  CSPR: {
    name: "Casper",
    chainId: 1,
    symbol: "CSPR",
    symbolPair: "WCSPR",
    decimals: 9,
    contractHash: "",
    packageHash: "",
    logoURI: csprIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  CST: {
    name: "CasperSwap",
    chainId: 1,
    symbol: "CST",
    symbolPair: "CST",
    decimals: 9,
    contractHash:
      "hash-aff3a1beb6239317e84d898cd04e10aa3368f646009188ea596514b6bb1a34c9",
    packageHash:
      "hash-995947f349c23a1812f6c7702e75eb95afabdb5f389f150e4ddb91c9de6225f0",
    logoURI: cstIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  WBTC: {
    name: "Wrapped Bitcoin",
    chainId: 1,
    symbol: "WBTC",
    symbolPair: "WBTC",
    decimals: 9,
    contractHash:
      "hash-66d17f410f45a29bd710175fdbf03277619a797fa5b7a3858d1dd2e386cfac9f",
    packageHash:
      "hash-883238e99639bc7f5f7858398d0df94138c8ad89f76bdef7fac5fdd3df7f033a",
    logoURI: wbtcIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  WETH: {
    name: "Wrapped Ether",
    chainId: 1,
    symbol: "WETH",
    symbolPair: "WETH",
    decimals: 9,
    contractHash:
      "hash-82a894a18840f988dd87b3121a52ed951bb16236ff772572b9531f93a51aa7f7",
    packageHash:
      "hash-28eed3da2b123334c7913d84c4aea0ed426fd268d29410cb12c6bc8a453183f6",
    logoURI: wethIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  WCSPR: {
    name: "Wrapped Casper",
    chainId: 1,
    symbol: "WCSPR",
    symbolPair: "WCSPR",
    decimals: 9,
    contractHash:
      "hash-785aa60c219869f1770d1aa44cebfaf3a8fc0004551677b67d1441bdc57470c1",
    packageHash:
      "hash-0885c63f5f25ec5b6f3b57338fae5849aea5f1a2c96fc61411f2bfc5e432de5a",
    logoURI: wcsprIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  USDT: {
    name: "Tether",
    chainId: 1,
    symbol: "USDT",
    symbolPair: "USDT",
    decimals: 9,
    contractHash:
      "hash-bffffa8755571a90fa20b35ed3d0fc47aeecab52eca73138e27109d4d5e9dc57",
    packageHash:
      "hash-a7672d33a577d196a42b9936025c2edc22b25c20cc16b783a3790c8e35f71e0b",
    logoURI: usdtIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  USDC: {
    name: "USD Coin",
    chainId: 1,
    symbol: "USDC",
    symbolPair: "USDC",
    decimals: 9,
    contractHash:
      "hash-a08a6565f8437daa52eb45c0ce70b5640ad048b9e6e1ca66b84e8d37e40b5257",
    packageHash:
      "hash-e43357d2be4f5cd2d744e218eb7bf79148f0fa777b111a71c6d587f054a50b44",
    logoURI: usdcIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  dWBTC: {
    name: "Debug Wrapped BTC",
    chainId: 1,
    symbol: "dWBTC",
    symbolPair: "dWBTC",
    decimals: 8,
    contractHash:
      "hash-27dcb2efc403047a3f9fdad8acf879e3630706c9a38d28b8ef44201b1581fb3e",
    packageHash:
      "hash-a3bce716f129605e5c47147976b0053b5632106d184fb6903ae63aa883905af9",
    logoURI: dwbtc,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
}
export const TOKENS: Record<string, Token> = {}

Object.values(RAW_TOKENS).map((t) => {
  const token = Object.assign({}, t)
  TOKENS[t.symbol] = token
})

export const initialTokenState: TokenState = {
  tokens: TOKENS,
  firstTokenSelected: 'CSPR',
  secondTokenSelected: 'WETH',
};

export enum TokenActions {
  UPDATE_TOKENS = "UPDATE_TOKENS",
  SELECT_FIRST_TOKEN = "SELECT_FIRST_TOKEN",
  SELECT_SECOND_TOKEN = "SELECT_SECOND_TOKEN",
  LOAD_BALANCE = "LOAD_BALANCE",
  LOAD_ALLOWANCE = "LOAD_ALLOWANCE",
  LOAD_PRICE_USD = "LOAD_PRICE_USD",
  SWITCH_TOKENS = "SWITCH_TOKENS",
  RESET = "RESET",
}

export type TokenAction = {
  type: TokenActions.UPDATE_TOKENS,
  payload: {
    tokens: Record<string, Token>,
  },
} | {
  type: TokenActions.SELECT_FIRST_TOKEN,
  payload: string,
} | {
  type: TokenActions.SELECT_SECOND_TOKEN,
  payload: string,
} | {
  type: TokenActions.SELECT_SECOND_TOKEN,
  payload: string,
} | {
  type: TokenActions.LOAD_BALANCE,
  payload: {
    name: string,
    amount: string,
  },
} | {
  type: TokenActions.LOAD_ALLOWANCE,
  payload: {
    name: string,
    allowance: string,
  },
} | {
  type: TokenActions.LOAD_PRICE_USD,
  payload: {
    name: string,
    priceUSD: string,
  },
} | {
  type: TokenActions.SWITCH_TOKENS,
} | {
    type: TokenActions.RESET,
}

export function TokenReducer(state: TokenState, action: TokenAction) {
  switch (action.type) {
    case TokenActions.UPDATE_TOKENS:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          ...action.payload.tokens
        },
      };
    case TokenActions.SELECT_FIRST_TOKEN:
      return { ...state, firstTokenSelected: action.payload };
    case TokenActions.SELECT_SECOND_TOKEN:
      return { ...state, secondTokenSelected: action.payload };
    case TokenActions.LOAD_BALANCE:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [action.payload.name]: {
            ...state.tokens[action.payload.name],
            amount: action.payload.amount,
          },
        },
      };
    case TokenActions.LOAD_ALLOWANCE:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [action.payload.name]: {
            ...state.tokens[action.payload.name],
            allowance: action.payload.allowance,
          },
        },
      };
    case TokenActions.LOAD_PRICE_USD:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [action.payload.name]: {
            ...state.tokens[action.payload.name],
            priceUSD: action.payload.priceUSD,
          },
        },
      };
    case TokenActions.SWITCH_TOKENS:
      return {
        ...state,
        firstTokenSelected: state.secondTokenSelected,
        secondTokenSelected: state.firstTokenSelected,
      };
    case TokenActions.RESET:
        return initialTokenState;
    default:
      return state;
  }
}
