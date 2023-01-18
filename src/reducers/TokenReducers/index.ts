import csprIcon from "../../assets/swapIcons/casperIcon.png"
import wcsprIcon from "../../assets/swapIcons/wrappedCasperIcon.png"
import csxIcon from "../../assets/swapIcons/casperswap.png"
import wethIcon from "../../assets/swapIcons/wethIcon.svg"

import { Token } from '../../commons/api'

export interface TokenState {
  tokens: Record<string, Token>,
  firstTokenSelected: string,
  secondTokenSelected: string,
}
export const initialTokenState: TokenState = {
  tokens: {
    CSPR: {
      name: "Casper",
      chainId: 1,
      symbol: "CSPR",
      symbolPair: "WCSPR",
      decimals: 9,
      contractHash: "",
      packageHash: "",
      logoURI: csprIcon,
      amount: "",
      allowance: "0.0000",
    },
    CSX: {
      name: "CasperSwap",
      chainId: 1,
      symbol: "CSX",
      symbolPair: "CSX",
      decimals: 9,
      contractHash:
        "hash-df0180b2233a674667fc2b65610ba8f70a401ace164c292166d41db87ddbaa94",
      packageHash:
        "hash-4a2e5b5169b756d571e5014baf9bb76deb5b780509e8db17fb80ed6251204deb",
      logoURI: csxIcon,
      amount: "",
      allowance: "0.0000",
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
      amount: "",
      allowance: "0.0000",
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
      amount: "",
      allowance: "0.0000",
    },
  },
  firstTokenSelected: 'CSPR',
  secondTokenSelected: 'WETH',
};

export enum TokenActions {
  UPDATE_TOKENS = "UPDATE_TOKENS",
  SELECT_FIRST_TOKEN = "SELECT_FIRST_TOKEN",
  SELECT_SECOND_TOKEN = "SELECT_SECOND_TOKEN",
  LOAD_BALANCE = "LOAD_BALANCE",
  LOAD_ALLOWANCE = "LOAD_ALLOWANCE",
  SWITCH_TOKENS = "SWITCH_TOKENS",
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
  type: TokenActions.SWITCH_TOKENS,
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
    case TokenActions.SWITCH_TOKENS:
      return {
        ...state,
        firstTokenSelected: state.secondTokenSelected,
        secondTokenSelected: state.firstTokenSelected,
      };
    default:
      return state;
  }
}
