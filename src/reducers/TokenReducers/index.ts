import csprIcon from "../../assets/swapIcons/casperIcon.png"
import wcsprIcon from "../../assets/swapIcons/wrappedCasperIcon.png"
import csxIcon from "../../assets/swapIcons/coinstoxIcon.png"
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
      name: "Coinstox",
      chainId: 1,
      symbol: "CSX",
      symbolPair: "CSX",
      decimals: 9,
      contractHash:
        "hash-5240db456a1a2cb63cabcdebb86a5177d0e9ceddab7a737b3bd90caeae33e80e",
      packageHash:
        "hash-bdcd8c9844cd2f98c81b3f98ce806f20c5a625f954d7b29bf70626fef060ff1f",
      logoURI: csxIcon,
      amount: "",
      allowance: "0.0000",
    },
    WETH: {
      name: "Wrapper Ether",
      chainId: 1,
      symbol: "WETH",
      symbolPair: "WETH",
      decimals: 9,
      contractHash:
        "hash-9aef66efbac45daf71f92f3446422a00fd3adaaf206a1c29d80f26bc513c105d",
      packageHash:
        "hash-03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
      logoURI: wethIcon,
      amount: "",
      allowance: "0.0000",
    },
    WCSPR: {
      name: "Wrapper Casper",
      chainId: 1,
      symbol: "WCSPR",
      symbolPair: "WCSPR",
      decimals: 9,
      contractHash:
        "hash-238834bc76aed9e18ad0260e65d2ef751999c97c13da92dee83bd511e31e2d2d",
      packageHash:
        "hash-afcaa550ebb63266fb2752b58ecd7e8fcd78e0a75777ecd57045213a013d9813",
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
        tokens: { ...state.tokens, ...action.payload.tokens },
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
