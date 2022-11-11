import BigNumber from 'bignumber.js'

export type PairData = {
  name: string
  id: string
  balance: BigNumber.Value,
}

export type PairState = Record<string, PairData>

export const initialPairsState: PairState = {
  "WETH-CSX": {
    name: "WETH-CSX",
    id: "c956ddec09b725a217ac5480fc9cef2411c73b6aaac2e6215ca7255d20f77485",
    balance: '0',
  },
  "WCSPR-CSX": {
    name: "WCSPR-CSX",
    id: "a84382872d1402a5ec8d8453f516586166100d8252f997b0bcdeed8c4737588d",
    balance: '0',
  },
  "WCSPR-WETH": {
    name: "WCSPR-WETH",
    id: "cb0f9f291ae73928b739c90c03eca70cd610d945304ea606fe4adced3fa07060",
    balance: '0',
  },
}

export type PairActionPayload = {
  name: string,
  balance: string,
}

export type PairAction = {
  type: 'ADD_BALANCE_TO_PAIR',
  payload: PairActionPayload,
}

export function PairsReducer(state: PairState, action: PairAction) {
  switch (action.type) {
    case "ADD_BALANCE_TO_PAIR":
      return {
        ...state,
        [`${action.payload.name}`]: {
          ...state[`${action.payload.name}`],
          balance: action.payload.balance,
        },
      };
    /*case "GET_PAIRS":
      return { ...state };*/
  }
}
