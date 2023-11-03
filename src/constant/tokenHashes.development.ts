import {Token} from "../commons";
import csprIcon from "../assets/swapIcons/casperIcon.png";
import cstIcon from "../assets/swapIcons/casperswap.png";
import wbtcIcon from "../assets/swapIcons/btc.png";
import wethIcon from "../assets/swapIcons/wethIcon.svg";
import wcsprIcon from "../assets/swapIcons/wrappedCasperIcon.png";
import usdtIcon from "../assets/swapIcons/tether.png";
import usdcIcon from "../assets/swapIcons/usdc.png";
import dwbtc from "../assets/swapIcons/dwbtc.png";
import nfi from "../assets/swapIcons/nfi.svg";

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
      "hash-848426b2cb8be4ef6dca0d76e0202ecaae4054739f0c13f512c0b07e549ffd10",
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
      "hash-71afe14308465f7eb7f49463df96ba52cf2da8e1deeb64a1d0978af9170e52ce",
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
      "hash-906e222218c54ff108d8b88d6b7f4fdcb4b5c41428463166f9ac2abf25cc4178",
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
      "hash-aa4d81fd8c4fa89b20827330a0b23c841bec510afeb9a6c150d77c38426396da",
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
      "hash-da217de766096f168ad906a8eb2a8f48e32717bcf5fd1124188eda6193c6b7f7",
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
      "hash-b5aa8961b1dae0eab3e828da836911d339b30f3e90c8ed479eb797789fe8e9f2",
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
    optApproval: "approve"
  },
  NFI: {
    name: "NexFi Token",
    chainId: 1,
    symbol: "NFI",
    symbolPair: "NFI",
    decimals: 3,
    contractHash:
      "hash-4a31d64f1c5c09ce791083db791303f1f2cf83c208efc0a37ee1a3bf7422d9a7",
    packageHash:
      "hash-04ff7ad6975508fffb5a2f364323503fb045b6d1eaeb9aeaa7283c046e0b6710",
    logoURI: nfi,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
    optApproval: "approve"
  },
}