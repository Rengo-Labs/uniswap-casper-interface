import {Token} from "../commons";
import csprIcon from "../assets/swapIcons/casperIcon.png";
import cstIcon from "../assets/swapIcons/casperswap.png";
import wbtcIcon from "../assets/swapIcons/btc.png";
import wethIcon from "../assets/swapIcons/wethIcon.svg";
import wcsprIcon from "../assets/swapIcons/wrappedCasperIcon.png";
import usdtIcon from "../assets/swapIcons/tether.png";
import usdcIcon from "../assets/swapIcons/usdc.png";
import dwbtc from "../assets/swapIcons/dwbtc.png";

export const tokenList: Record<string, Token> = {
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
      "hash-595c463ecbf8b61ff76c91dc90297283989ad41077fba88a8a4f76cc5f2976c2",
    packageHash:
      "hash-b9b912b1f4a2d4171dff3e04b20a8f6f4f0f2d79dfb782de988145ce257ae639",
    logoURI: cstIcon,
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
      "hash-6b7453749234eb23f6e81aa2fe01b3a8f4bafb94247942a6ac0d77e952978afa",
    packageHash:
      "hash-c6649901da894d4ac2c77c0ae217190f79cabc8c0c91788ee997f670b8bdd05e",
    logoURI: wcsprIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  dBTC: {
    name: "Debug BTC",
    chainId: 1,
    symbol: "dBTC",
    symbolPair: "dBTC",
    decimals: 9,
    contractHash:
      "hash-3e46fdbcd0e5882ef2130456195f1658f02789b4b69a8e8e1dde773c2565555a",
    packageHash:
      "hash-c44d2505862832d8043fbe32f068b92895f84b2e479f8a29954a94fce6835360",
    logoURI: dwbtc,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00"
  },
}
