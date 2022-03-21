import React, { createContext, useState } from 'react'
import casprIcon from '../../assets/swapIcons/casprIcon.png'

export const PoolsProviderContext = createContext(null)
export const PoolsContext = ({ children }) => {

  const [tokens, setTokens] = useState([
    {
      tokeIcon: casprIcon.src,
      tokeName: "CSPR-WETH",
      tokenLiquidity: "$78.438.726.23",
      volume24h: "$11.645.726.23",
      volume7d: "$20.666.726.23",
      fees24h: "$10.438.726.23",
      oneYFees: "13.19%",
    },
    {
      tokeIcon: casprIcon.src,
      tokeName: "WCSPR-WETH",
      tokenLiquidity: "$60.438.726.23",
      volume24h: "$20.645.726.23",
      volume7d: "$25.666.726.23",
      fees24h: "$18.438.726.23",
      oneYFees: "20.19%",
    },
    {
      tokeIcon: casprIcon.src,
      tokeName: "CSPR-WISER",
      tokenLiquidity: "$96.258.741.99",
      volume24h: "$60.258.852.64",
      volume7d: "$46.471.451.45",
      fees24h: "$36.351.378.36",
      oneYFees: "47.0%",
    },
    {
      tokeIcon: casprIcon.src,
      tokeName: "WISER-WCSPR",
      tokenLiquidity: "$50.320.147.23",
      volume24h: "$41.184.286.40",
      volume7d: "$60.547.413.20",
      fees24h: "$30.126.214.60",
      oneYFees: "33.47%",
    },
    {
      tokeIcon: casprIcon.src,
      tokeName: "WETH-WISER",
      tokenLiquidity: "$78.438.726.23",
      volume24h: "$22.848.464.14",
      volume7d: "$40.879.726.16",
      fees24h: "$984.654.471.19",
      oneYFees: "15.0%",
    },
    {
      tokeIcon: casprIcon.src,
      tokeName: "CSPR-USDC",
      tokenLiquidity: "$100.438.726.23",
      volume24h: "$84.456.654.23",
      volume7d: "$25.888.841.23",
      fees24h: "$19.568.265.0",
      oneYFees: "28.36%",
    }
  ])
  const headers = [
    {
      Header: 'Icon',
      accessor: 'tokeIcon', // accessor is the "key" in the data
      disableFilters: true,
      Cell: tableProps => (
        <img
          src={tableProps.row.original.tokeIcon}
          width={25}
          alt='Player'
        />
      )
    },
    {
      Header: 'Name',
      accessor: 'tokeName', // accessor is the "key" in the data
    },
    {
      Header: 'Liquidity',
      accessor: 'tokenLiquidity',
    },
    {
      Header: 'Volume (24hrs)',
      accessor: 'volume24h',
    },
    {
      Header: 'Volume (7d)',
      accessor: 'volume7d',
    },
    {
      Header: 'Fees (24hrs)',
      accessor: 'fees24h',
    },
    {
      Header: '1Y Fees/Liquidity',
      accessor: 'oneYFees',
    }
  ]
  const columns = React.useMemo(() => headers, [])
  const data = React.useMemo(() => tokens, [])
  return (
    <PoolsProviderContext.Provider value={{ columns, data }}>
      {children}
    </PoolsProviderContext.Provider>
  )
}
