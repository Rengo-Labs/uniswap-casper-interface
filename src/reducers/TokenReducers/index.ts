import { Token } from '../../commons/api'

export interface TokenState {
  tokens: Record<string, Token>,
  firstTokenSelected: string,
  secondTokenSelected: string,
}

import {tokenData, secondInitialToken} from '../../constant/bootEnvironmet'

const RAW_TOKENS = tokenData
export const TOKENS: Record<string, Token> = {}

Object.values(RAW_TOKENS).map((t) => {
  const token = Object.assign({}, t)
  TOKENS[t.symbol] = token
})

export const initialTokenState: TokenState = {
  tokens: TOKENS,
  firstTokenSelected: 'CSPR',
  secondTokenSelected: secondInitialToken,
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
    totalSupply: string
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
            totalSupply: action.payload.totalSupply
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
