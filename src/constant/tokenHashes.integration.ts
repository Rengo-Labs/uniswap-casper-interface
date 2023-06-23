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
      "hash-9d0235fe7f4ac6ba71cf251c68fdd945ecf449d0b8aecb66ab0cbc18e80b3477",
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
      "hash-6b7453749234eb23f6e81aa2fe01b3a8f4bafb94247942a6ac0d77e952978afa",
    packageHash:
      "hash-c6649901da894d4ac2c77c0ae217190f79cabc8c0c91788ee997f670b8bdd05e",
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
    decimals: 8,
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
    decimals: 6,
    contractHash:
      "hash-45043899ae260f320f0efe11287b04470aab44548a93b0eec948dbcdf6bc1846",
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
    decimals: 6,
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
    decimals: 18,
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
