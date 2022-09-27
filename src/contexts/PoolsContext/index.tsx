import React, { createContext, ReactNode, useState } from 'react'
import casprIcon from '../../assets/swapIcons/casprIcon.png'
import wethIcon from '../../assets/swapIcons/wethIcon.svg'

export const PoolsProviderContext = createContext<any>({})
export const PoolsContext = ({ children }:{children:ReactNode}) => {

  const [tokens, setTokens] = useState([
    {
      tokeIcon1: wethIcon,
      tokeIcon2: casprIcon,
      tokeName: "CSPR-WETH",
      tokenLiquidity: "78,438,726.23",
      volume24h: "11,645,726.23",
      volume7d: "20,666,726.23",
      fees24h: "0",
      oneYFees: "0%",
      pair: {
        token0: "CSPR",
        token1: "WETH",
        volumePercentage: "20",
        token0Liquidity: "30,000,000",
        token1Liquidity: "120,000,000",
        totalLiquidityPool: "2,000",
        totalLiquidityUSD: "200,000,000"
      }
    },
    {
      tokeIcon1: wethIcon,
      tokeIcon2: casprIcon,
      tokeName: "WCSPR-WETH",
      tokenLiquidity: "60,438,726.23",
      volume24h: "20,645,726.23",
      volume7d: "25,666,726.23",
      fees24h: "0",
      oneYFees: "0%",
      pair: {
        token0: "WCSPR",
        token1: "WETH",
        volumePercentage: "10",
        token0Liquidity: "30,000,000",
        token1Liquidity: "120,000,000",
        totalLiquidityPool: "2,000",
        totalLiquidityUSD: "200,000,000"
      }
    },
    {
      tokeIcon1: wethIcon,
      tokeIcon2: casprIcon,
      tokeName: "CSPR-WISER",
      tokenLiquidity: "96,258,741.99",
      volume24h: "60,258,852.64",
      volume7d: "46,471,451.45",
      fees24h: "1,378.36",
      oneYFees: "47.0%",
      pair: {
        token0: "CSPR",
        token1: "WISER",
        volumePercentage: "0",
        token0Liquidity: "0",
        token1Liquidity: "0",
        totalLiquidityPool: "0",
        totalLiquidityUSD: "0"
      }
    },
    {
      tokeIcon1: wethIcon,
      tokeIcon2: casprIcon,
      tokeName: "WISER-WCSPR",
      tokenLiquidity: "50,320,147.23",
      volume24h: "41,184,286.40",
      volume7d: "60,547,413.20",
      fees24h: "6,214.60",
      oneYFees: "33.47%",
      pair: {
        token0: "WISER",
        token1: "WCSPR",
        volumePercentage: "0",
        token0Liquidity: "0",
        token1Liquidity: "0",
        totalLiquidityPool: "0",
        totalLiquidityUSD: "0"
      }
    },
    {
      tokeIcon1: wethIcon,
      tokeIcon2: casprIcon,
      tokeName: "WETH-WISER",
      tokenLiquidity: "78,438,726.23",
      volume24h: "22,848,464.14",
      volume7d: "40,879.726.16",
      fees24h: "4,471.19",
      oneYFees: "15.0%",
      pair: {
        token0: "WETH",
        token1: "WISER",
        volumePercentage: "0",
        token0Liquidity: "0",
        token1Liquidity: "0",
        totalLiquidityPool: "0",
        totalLiquidityUSD: "0"
      }
    },
    {
      tokeIcon1: wethIcon,
      tokeIcon2: casprIcon,
      tokeName: "CSPR-USDC",
      tokenLiquidity: "100,438,726.23",
      volume24h: "84,456,654.23",
      volume7d: "25,888,841.23",
      fees24h: "8,265.00",
      oneYFees: "28.36%",
      pair: {
        token0: "CSPR",
        token1: "USDC",
        volumePercentage: "5",
        token0Liquidity: "30,000,000",
        token1Liquidity: "120,000,000",
        totalLiquidityPool: "2,000",
        totalLiquidityUSD: "200,000,000"
      }
    },
    {
      tokeIcon1: casprIcon,
      tokeIcon2: wethIcon,
      tokeName: "BNB-USDC",
      tokenLiquidity: "100,438,726.23",
      volume24h: "84,456,654.23",
      volume7d: "25,888,841.23",
      fees24h: "8,265.00",
      oneYFees: "28.36%",
      pair: {
        token0: "BNB",
        token1: "USDC",
        volumePercentage: "0",
        token0Liquidity: "0",
        token1Liquidity: "0",
        totalLiquidityPool: "0",
        totalLiquidityUSD: "0"
      }
    },
    {
      tokeIcon1: casprIcon,
      tokeIcon2: wethIcon,
      tokeName: "CSPR-SOL",
      tokenLiquidity: "100,438,726.23",
      volume24h: "84,456,654.23",
      volume7d: "25,888,841.23",
      fees24h: "8,265.00",
      oneYFees: "28.36%",
      pair: {
        token0: "CSPR",
        token1: "SOL",
        volumePercentage: "0",
        token0Liquidity: "0",
        token1Liquidity: "0",
        totalLiquidityPool: "0",
        totalLiquidityUSD: "0"
      }
    },
    {
      tokeIcon1: casprIcon,
      tokeIcon2: wethIcon,
      tokeName: "CSPR-DOT",
      tokenLiquidity: "100,438,726.23",
      volume24h: "84,456,654.23",
      volume7d: "25,888,841.23",
      fees24h: "8,265.00",
      oneYFees: "28.36%",
      pair: {
        token0: "CSPR",
        token1: "DOT",
        volumePercentage: "0",
        token0Liquidity: "0",
        token1Liquidity: "0",
        totalLiquidityPool: "0",
        totalLiquidityUSD: "0"
      }
    }
  ])
  const headers = [
    {
      id: 1,
      Header: 'Pool',
      accessor: 'tokeIcon',
      Cell: (tableProps:any) => (
        <img
          src={tableProps.row.original.tokeIcon}
          width={25}
          alt='Token Icon'
        />
      )
    },
    {
      id: 2,
      Header: 'Liquidity',
      accessor: 'tokenLiquidity',
    },
    {
      id: 3,
      Header: 'Volume 7D',
      accessor: 'volume24h',
    },
    {
      id: 4,
      Header: 'Fees 7d',
      accessor: 'volume7d',
    },
    {
      id: 5,
      Header: 'APR 7D',
      accessor: 'fees24h',
    }
  ]
  const columns = React.useMemo(() => headers, [])
  const data = React.useMemo(() => tokens, [])

  const filter = (onlyStaked) => {
    if (onlyStaked) {
      const result = tokens.filter(t => parseFloat(t.pair.totalLiquidityPool) > 0)
      console.log(result)
    }

    return tokens
  }

  return (
    <PoolsProviderContext.Provider value={{ columns, data, filter }}>
      {children}
    </PoolsProviderContext.Provider>
  )
}
