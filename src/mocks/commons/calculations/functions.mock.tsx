import {TokenState} from "../../../reducers/TokenReducers";
import {PairState} from "../../../reducers/PairsReducer";

export const initialPairsStateMock1: PairState = {
  "CSX-WETH": {
    checked: false,
    name: "CSX-WETH",
    contractHash: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    packageHash: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'CSX',
    token1Symbol: 'WETH',
    token0Name: 'Wrapper Ether',
    token1Name: 'Coinstox',
    decimals: 9,
  },
  "CSX-WCSPR": {
    checked: false,
    name: "CSX-WCSPR",
    contractHash: "hash-9b4f66939ce96621b5f60386f57ae8c4c8f998e4156caf6e5b8bea987756e7d3",
    packageHash: "hash-9b4f66939ce96621b5f60386f57ae8c4c8f998e4156caf6e5b8bea987756e7d3",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'CSX',
    token1Symbol: 'WCSPR',
    token0Name: 'Wrapper Casper',
    token1Name: 'Coinstox',
    decimals: 9,
  },
  "WETH-WCSPR": {
    checked: false,
    name: "WETH-WCSPR",
    contractHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8dd",
    packageHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8dd",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'WETH',
    token1Symbol: 'WCSPR',
    token0Name: 'Wrapper Ether',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
}

export const initialTokenStateMock1: TokenState = {
  tokens: {
    CSPR: {
      name: "Casper",
      chainId: 1,
      symbol: "CSPR",
      symbolPair: "WCSPR",
      decimals: 9,
      contractHash: "",
      packageHash: "",
      logoURI: null,
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
        "hash-df0180b2233a674667fc2b65610ba8f70a401ace164c292166d41db87ddbaa94",
      packageHash:
        "hash-4a2e5b5169b756d571e5014baf9bb76deb5b780509e8db17fb80ed6251204deb",
      logoURI: null,
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
        "hash-82a894a18840f988dd87b3121a52ed951bb16236ff772572b9531f93a51aa7f7",
      packageHash:
        "hash-28eed3da2b123334c7913d84c4aea0ed426fd268d29410cb12c6bc8a453183f6",
      logoURI: null,
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
        "hash-785aa60c219869f1770d1aa44cebfaf3a8fc0004551677b67d1441bdc57470c1",
      packageHash:
        "hash-0885c63f5f25ec5b6f3b57338fae5849aea5f1a2c96fc61411f2bfc5e432de5a",
      logoURI: null,
      amount: "",
      allowance: "0.0000",
    },
  },
  firstTokenSelected: 'CSPR',
  secondTokenSelected: 'WETH',
}

export const initialPairsStateMock2: PairState = {
  "USDC-WCSPR": {
    checked: false,
    name: "USDC-WCSPR",
    contractHash: "hash-b080106ba9a0838173c4a41b29220deae768d0614bfbebfe653ca8a52a0bc23d",
    packageHash: "hash-b080106ba9a0838173c4a41b29220deae768d0614bfbebfe653ca8a52a0bc23d",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'USDC',
    token1Symbol: 'WCSPR',
    token0Name: 'WUSDC',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
  "DAI-WCSPR": {
    checked: false,
    name: "DAI-WCSPR",
    contractHash: "hash-0576fbbe71ea1beef03a384a3cfa5be9ea90e849900f8442a7c0860f5bec3e96",
    packageHash: "hash-0576fbbe71ea1beef03a384a3cfa5be9ea90e849900f8442a7c0860f5bec3e96",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'DAI',
    token1Symbol: 'WCSPR',
    token0Name: 'DAI',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
  "USDT-WCSPR": {
    checked: false,
    name: "USDT-WCSPR",
    contractHash: "hash-17277427f5bc536313f1e8b536d9bb6ab87ff13583402679b582d9b6b1774aaf",
    packageHash: "hash-17277427f5bc536313f1e8b536d9bb6ab87ff13583402679b582d9b6b1774aaf",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'USDT',
    token1Symbol: 'WCSPR',
    token0Name: 'TETHER',
    token1Name: 'WRAPPER CASPER',
    decimals: 9,
  },
  "CSX-WETH": {
    checked: false,
    name: "CSX-WETH",
    contractHash: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    packageHash: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'CSX',
    token1Symbol: 'WETH',
    token0Name: 'Wrapper Ether',
    token1Name: 'Coinstox',
    decimals: 9,
  },
  "CSX-WCSPR": {
    checked: false,
    name: "CSX-WCSPR",
    contractHash: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    packageHash: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'CSX',
    token1Symbol: 'WCSPR',
    token0Name: 'Wrapper Casper',
    token1Name: 'Coinstox',
    decimals: 9,
  },
  "WETH-WCSPR": {
    checked: false,
    name: "WETH-WCSPR",
    contractHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8dd",
    packageHash: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'WETH',
    token1Symbol: 'WCSPR',
    token0Name: 'Wrapper Ether',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
}


export const initialTokenStateMock2: TokenState = {
  tokens: {
    CSPR: {
      name: "Casper",
      chainId: 1,
      symbol: "CSPR",
      symbolPair: "WCSPR",
      decimals: 9,
      contractHash: "",
      packageHash: "",
      logoURI: null,
      amount: "",
      allowance: "0.0000",
    },
    USDC: {
      name: "DAI",
      chainId: 1,
      symbol: "DAI",
      symbolPair: "DAI",
      decimals: 9,
      contractHash: "hash-63656080ea8f8c5b0fe6fac1e8fad31291743b353c772c7079c66a00babac20c",
      packageHash: "hash-e43357d2be4f5cd2d744e218eb7bf79148f0fa777b111a71c6d587f054a50b44",
      logoURI: null,
      amount: "",
      allowance: "0.0000",
    },
    DAI: {
      name: "USDC",
      chainId: 1,
      symbol: "USDC",
      symbolPair: "USDC",
      decimals: 9,
      contractHash: "hash-a08a6565f8437daa52eb45c0ce70b5640ad048b9e6e1ca66b84e8d37e40b5257",
      packageHash: "hash-31b15936ee5276803212bcde81a55ec2bd193fcd052256c111373fabe8facab0",
      logoURI: null,
      amount: "",
      allowance: "0.0000",
    },
    USDT: {
      name: "TETHER",
      chainId: 1,
      symbol: "USDT",
      symbolPair: "USDT",
      decimals: 9,
      contractHash: "hash-bffffa8755571a90fa20b35ed3d0fc47aeecab52eca73138e27109d4d5e9dc57",
      packageHash: "hash-a7672d33a577d196a42b9936025c2edc22b25c20cc16b783a3790c8e35f71e0b",
      logoURI: null,
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
        "hash-df0180b2233a674667fc2b65610ba8f70a401ace164c292166d41db87ddbaa94",
      packageHash:
        "hash-4a2e5b5169b756d571e5014baf9bb76deb5b780509e8db17fb80ed6251204deb",
      logoURI: null,
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
        "hash-82a894a18840f988dd87b3121a52ed951bb16236ff772572b9531f93a51aa7f7",
      packageHash:
        "hash-28eed3da2b123334c7913d84c4aea0ed426fd268d29410cb12c6bc8a453183f6",
      logoURI: null,
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
        "hash-785aa60c219869f1770d1aa44cebfaf3a8fc0004551677b67d1441bdc57470c1",
      packageHash:
        "hash-0885c63f5f25ec5b6f3b57338fae5849aea5f1a2c96fc61411f2bfc5e432de5",
      logoURI: null,
      amount: "",
      allowance: "0.0000",
    },
  },
  firstTokenSelected: 'CSPR',
  secondTokenSelected: 'WETH',
}


export const initialPairsStateMock3: PairState = {
  "USDC-WCSPR": {
    checked: false,
    name: "USDC-WCSPR",
    contractHash: "hash-b080106ba9a0838173c4a41b29220deae768d0614bfbebfe653ca8a52a0bc23d",
    packageHash: "hash-b080106ba9a0838173c4a41b29220deae768d0614bfbebfe653ca8a52a0bc23d",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'USDC',
    token1Symbol: 'WCSPR',
    token0Name: 'USDC',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
  "DAI-WCSPR": {
    checked: false,
    name: "DAI-WCSPR",
    contractHash: "hash-0576fbbe71ea1beef03a384a3cfa5be9ea90e849900f8442a7c0860f5bec3e96",
    packageHash: "hash-0576fbbe71ea1beef03a384a3cfa5be9ea90e849900f8442a7c0860f5bec3e96",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'DAI',
    token1Symbol: 'WCSPR',
    token0Name: 'DAI',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
  "USDT-WCSPR": {
    checked: false,
    name: "USDT-WCSPR",
    contractHash: "hash-17277427f5bc536313f1e8b536d9bb6ab87ff13583402679b582d9b6b1774aaf",
    packageHash: "hash-17277427f5bc536313f1e8b536d9bb6ab87ff13583402679b582d9b6b1774aaf",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'USDT',
    token1Symbol: 'WCSPR',
    token0Name: 'TETHER',
    token1Name: 'WRAPPER CASPER',
    decimals: 9,
  },
  "CSX-WETH": {
    checked: false,
    name: "CSX-WETH",
    contractHash: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    packageHash: "hash-b9d9fe8057c2df9e1126582b7962b2fff22f91aa59014f8b02ee11075dd19670",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'CSX',
    token1Symbol: 'WETH',
    token0Name: 'Wrapper Ether',
    token1Name: 'Coinstox',
    decimals: 9,
  },
  "CSX-WCSPR": {
    checked: false,
    name: "CSX-WCSPR",
    contractHash: "hash-9b4f66939ce96621b5f60386f57ae8c4c8f998e4156caf6e5b8bea987756e7d3",
    packageHash: "hash-9b4f66939ce96621b5f60386f57ae8c4c8f998e4156caf6e5b8bea987756e7d3",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'CSX',
    token1Symbol: 'WCSPR',
    token0Name: 'Wrapper Casper',
    token1Name: 'Coinstox',
    decimals: 9,
  },
  "WETH-WCSPR": {
    checked: false,
    name: "WETH-WCSPR",
    contractHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8dd",
    packageHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8dd",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'WETH',
    token1Symbol: 'WCSPR',
    token0Name: 'Wrapper Ether',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
  "WETH-SOL": {
    checked: false,
    name: "WETH-SOL",
    contractHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa813",
    packageHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa813",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'WETH',
    token1Symbol: 'SOL',
    token0Name: 'Wrapper Ether',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
  "DAI-SOL": {
    checked: false,
    name: "DAI-SOL",
    contractHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8af",
    packageHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa813",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'DAI',
    token1Symbol: 'SOL',
    token0Name: 'Wrapper Ether',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
  "DOT-SOL": {
    checked: false,
    name: "DOT-SOL",
    contractHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa899",
    packageHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa899",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'DOT',
    token1Symbol: 'SOL',
    token0Name: 'Wrapper Ether',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
  "DOT-BNB": {
    checked: false,
    name: "DOT-BNB",
    contractHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8df",
    packageHash: "hash-38d062de4d40d8f3a1f5352d080c5393f27a52b4685a97fb0784979dd2bfa8df",
    reserve0: '0',
    reserve1: '0',
    totalReserve0: '0',
    totalReserve1: '0',
    balance: '0',
    allowance: '0',
    token0Icon: null,
    token1Icon: null,
    token0Symbol: 'DOT',
    token1Symbol: 'BNB',
    token0Name: 'Wrapper Ether',
    token1Name: 'Wrapper Casper',
    decimals: 9,
  },
}

export const initialTokenStateMock3: TokenState = {
  tokens: {
    DOT: {
      name: "POLKA DOT",
      chainId: 1,
      symbol: "DOT",
      decimals: 9,
      contractHash: "hash-63656089da8f8c5b0fe6fac1e8fad31291743b353c772c7079c66a00babac20c",
      packageHash: "hash-e43357d23e4f5cd2d744e218eb7bf79148f0fa777b111a71c6d587f054a50b44",
      logoURI: null,
    },
    SOL: {
      name: "SOLANA",
      chainId: 1,
      symbol: "SOL",
      decimals: 9,
      contractHash: "hash-63656080ea8f8c5b0fe6fac1e8fdf31291743b353c772c7079c66a00babac20c",
      packageHash: "hash-e43357d2be4f5cd2d744e218eb44f79148f0fa777b111a71c6d587f054a50b44",
      logoURI: null,
    },
    BNB: {
      name: "BINANCE",
      chainId: 1,
      symbol: "BNB",
      decimals: 9,
      contractHash: "hash-63656080ea8f8c5b0fe6fac1e8fad31291743b353c772c7079c66a00babac40c",
      packageHash: "hash-e43357d2be4f5cd2d744e218eb7bf79148f0fa777b111a71c6d587f054a50b50",
      logoURI: null,
    },
    CSPR: {
      name: "Casper",
      chainId: 1,
      symbol: "CSPR",
      decimals: 9,
      contractHash: "",
      packageHash: "",
      logoURI: null,
    },
    USDC: {
      name: "USDC",
      chainId: 1,
      symbol: "USDC",
      decimals: 9,
      contractHash: "hash-63656080ea8f8c5b0fe6fac1e8fad31291743b353c772c7079c66a00babac20c",
      packageHash: "hash-e43357d2be4f5cd2d744e218eb7bf79148f0fa777b111a71c6d587f054a50b44",
      logoURI: null,
    },
    DAI: {
      name: "DAI",
      chainId: 1,
      symbol: "DAI",
      decimals: 9,
      contractHash: "hash-a08a6565f8437daa52eb45c0ce70b5640ad048b9e6e1ca66b84e8d37e40b5257",
      packageHash: "hash-31b15936ee5276803212bcde81a55ec2bd193fcd052256c111373fabe8facab0",
      logoURI: null,
    },
    USDT: {
      name: "TETHER",
      chainId: 1,
      symbol: "USDT",
      decimals: 9,
      contractHash: "hash-bffffa8755571a90fa20b35ed3d0fc47aeecab52eca73138e27109d4d5e9dc57",
      packageHash: "hash-a7672d33a577d196a42b9936025c2edc22b25c20cc16b783a3790c8e35f71e0b",
      logoURI: null,
    },
    CSX: {
      name: "Coinstox",
      chainId: 1,
      symbol: "CSX",
      decimals: 9,
      contractHash:
        "hash-df0180b2233a674667fc2b65610ba8f70a401ace164c292166d41db87ddbaa94",
      packageHash:
        "hash-4a2e5b5169b756d571e5014baf9bb76deb5b780509e8db17fb80ed6251204deb",
      logoURI: null,
    },
    WETH: {
      name: "Wrapper Ether",
      chainId: 1,
      symbol: "WETH",
      decimals: 9,
      contractHash:
        "hash-82a894a18840f988dd87b3121a52ed951bb16236ff772572b9531f93a51aa7f7",
      packageHash:
        "hash-28eed3da2b123334c7913d84c4aea0ed426fd268d29410cb12c6bc8a453183f6",
      logoURI: null,
    },
    WCSPR: {
      name: "Wrapper Casper",
      chainId: 1,
      symbol: "WCSPR",
      decimals: 9,
      contractHash:
        "hash-785aa60c219869f1770d1aa44cebfaf3a8fc0004551677b67d1441bdc57470c1",
      packageHash:
        "hash-0885c63f5f25ec5b6f3b57338fae5849aea5f1a2c96fc61411f2bfc5e432de5",
      logoURI: null,
    },
  },
  firstTokenSelected: 'CSPR',
  secondTokenSelected: 'WETH',
}
