import casprIcon from "../../assets/swapIcons/casprIcon.png";
import wcasprIcon from "../../assets/swapIcons/wcasprIcon.png";
import wiseIcon from "../../assets/swapIcons/wiseIcon.png";
import wethIcon from "../../assets/swapIcons/wethIcon.svg";

interface FullnameInterface {
  name: string;
  acron: string;
}
export interface TokensInterface {
  icon: string;
  fullname: FullnameInterface;
  amount: string;
}

export interface TokensListInterface {
  name: string;
  chainId: number;
  symbol: string;
  decimals: number;
  contractHash: string;
  packageHash: string;
  logoURI: string;
  amount: string;
}

export const initialStateToken = {
  tokens: {
    CSPR: {
      name: "Casper",
      chainId: 1,
      symbol: "CSPR",
      symbolPair: "WCSPR",
      decimals: 9,
      contractHash: "",
      packageHash: "",
      logoURI: casprIcon,
      amount: "0.0000",
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
      logoURI: "https://static.coincost.net/logo/cryptocurrency/coinstox.png",
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
      logoURI: "https://www.gemini.com/images/currencies/icons/default/eth.svg",
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
      logoURI: "https://miro.medium.com/max/3150/2*_dAX3saw1HVtj15WEJClHA.png",
    },
  },
  firstTokenSelected: {
    name: "Casper",
    chainId: 1,
    symbol: "CSPR",
    symbolPair: "WCSPR",
    decimals: 9,
    contractHash: "",
    packageHash: "",
    logoURI: casprIcon,
    amount: "0.0000",
  },
  secondTokenSelected: {
    name: "Wrapper Ether",
    chainId: 1,
    symbol: "WETH",
    symbolPair: "WETH",
    decimals: 9,
    contractHash:
      "hash-9aef66efbac45daf71f92f3446422a00fd3adaaf206a1c29d80f26bc513c105d",
    packageHash:
      "hash-03e3e09b28dc4d41a4507b38073e7a1641becc0b40e79beb72733d2fb022defa",
    logoURI: "https://www.gemini.com/images/currencies/icons/default/eth.svg",
    amount: "0.0000",
  }
};

export function TokenReducer(state, action) {
  switch (action.type) {
    case "UPDATE_TOKENS":
      return {
        ...state,
        tokens: { ...state.tokens, ...action.payload.tokens },
      };
    case "SELECT_FIRST_TOKEN":
      return { ...state, firstTokenSelected: action.payload };
    case "SELECT_SECOND_TOKEN":
      return { ...state, secondTokenSelected: action.payload };
    case "LOAD_BALANCE":
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [action.payload.name]: {
            ...state.tokens[action.payload.name],
            amount: action.payload.data,
          },
        },
        firstTokenSelected: {
          ...state.tokens[action.payload.name],
          amount: action.payload.data,
        },
      };
    case "SWITCH_TOKENS":
      return {
        ...state,
        firstTokenSelected: action.payload.secondTokenSelected,
        secondTokenSelected: action.payload.firstTokenSelected,
      };
    default:
      return state;
  }
}
