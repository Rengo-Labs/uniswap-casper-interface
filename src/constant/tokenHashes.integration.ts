import {Token} from "../commons";
import csprIcon from "../assets/swapIcons/casperIcon.png";
import cstIcon from "../assets/swapIcons/casperswap.png";
import wbtcIcon from "../assets/swapIcons/btc.png";
import wethIcon from "../assets/swapIcons/wethIcon.svg";
import wcsprIcon from "../assets/swapIcons/wrappedCasperIcon.png";
import usdtIcon from "../assets/swapIcons/tether.png";
import usdcIcon from "../assets/swapIcons/usdc.png";

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
      "hash-3ab25923574f4cc18148a39af69c66c07a611f13464ebab97d5e1daf6ee38018",
    packageHash:
      "hash-93d38a928e5a9a3030e60dc207b478a746a4369f5dbaf20f085fe4e19f4b12d2",
    logoURI: cstIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  WCSPR: {
    name: "Casper",
    chainId: 1,
    symbol: "WCSPR",
    symbolPair: "WCSPR",
    decimals: 9,
    contractHash:
      "hash-8c0d3b3461921a2fd9f8e337e13226863e19426a9065ac5fd9cc4aa32a15f61e",
    packageHash:
      "hash-ef602ea773953c82b9d3b4eef1b45b54e9fd40d1f82ed290e674c965539b1226",
    logoURI: wcsprIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
  },
  dBTC: {
    name: "BTC",
    chainId: 1,
    symbol: "dBTC",
    symbolPair: "dBTC",
    decimals: 9,
    contractHash:
      "hash-8604fa804afb17593d8625b5e667dd8b7e2e984a6f50e2d8446b088ce544fc7d",
    packageHash:
      "hash-db80ad6c6a5d40ef146c3470e2dc4f31203b1e146b3b470c5cae5cbc3d4edc30",
    logoURI: wbtcIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
    optApproval: "approve",
  },
  dUSDC: {
    name: "USD Coin",
    chainId: 1,
    symbol: "dUSDC",
    symbolPair: "dUSDC",
    decimals: 9,
    contractHash:
      "hash-9101dd2402246443b2f8a0f08c4635ab9416e0284e15a6f6884a414c768fcf45",
    packageHash:
      "hash-ab9ee4e04ec83f768346dfd0230404fa7dc9bfce8b1324af32bdbce076bc9f97",
    logoURI: usdcIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
    optApproval: "approve",
  },
  dUSDT: {
    name: "USD Tether",
    chainId: 1,
    symbol: "dUSDT",
    symbolPair: "dUSDT",
    decimals: 9,
    contractHash:
      "hash-c42797478e004fa301c3bd32db78b434c58ab8ab5624de130e6d5a5bd3e9d31c",
    packageHash:
      "hash-ec22366d01926cc86916d4e76ec31cbd5bbad23629fd41c56d1205d6481c3e30",
    logoURI: usdtIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
    optApproval: "approve",
  },
  dETH: {
    name: "Ethereum",
    chainId: 1,
    symbol: "dETH",
    symbolPair: "dETH",
    decimals: 9,
    contractHash:
      "hash-f898715a7c5d2922de51d283cf8a0fc87d2952b568b73d86fd4ec337af7ae7fe",
    packageHash:
      "hash-3cbdf16b0ac8d789b82629a0315ff06a25689eb166513800496e074c0c318057",
    logoURI: wethIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
    optApproval: "approve",
  }
}
