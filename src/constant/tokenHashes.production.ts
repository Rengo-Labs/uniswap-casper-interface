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
      "hash-7a437ac8dda6425bf65c3ae8a4c6ff0f40a629f8a2373c1069162ac638bf935f",
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
      "hash-526ef196ffc116c38a9f7a8549832d1fa915b3a83ecc7aa30bc1f101d6be01ca",
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
      "hash-3e46fdbcd0e5882ef2130456195f1658f02789b4b69a8e8e1dde773c2565555a",
    packageHash:
      "hash-c44d2505862832d8043fbe32f068b92895f84b2e479f8a29954a94fce6835360",
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
      "hash-48bd364532febf044cca8d2d716336b93d27458ce0aa48ad292ca28304fa8649",
    packageHash:
      "hash-354f65e7c195e246c6f1171b8c0c036794593b3fd84c2442046519e1d4c15cc0",
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
      "hash-b53fa728c7074c84f35407f4d0989eb4133d391402b7ce13b7feeb01479a4f01",
    packageHash:
      "hash-6a39adb3af054cbd3055e07213ec55343d8e785ac8a43b9717fb21da55dc1f40",
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
      "hash-012f8f3689ddf5c7a92ddeb54a311afb660051bb5fab3568dbb3d796809be8c6",
    packageHash:
      "hash-afc752ad814c4e05cafb25fb676fd74b65f1a340c5b5f0055814d3dd5115280a",
    logoURI: wethIcon,
    amount: "0.0000",
    allowance: "0.0000",
    priceUSD: "0.00",
    optApproval: "approve",
  }
}
