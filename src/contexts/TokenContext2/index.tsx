import React, { createContext, ReactNode, useState } from 'react'
import casprIcon from '../../assets/swapIcons/casprIcon.png'

export const TokensProviderContext2 = createContext<any>({})
export const TokensContext2 = ({ children }:{children:ReactNode}) => {

  const [tokens, setTokens] = useState([
    {
      tokeName:"WCSPR-WETH",
      tokenPrice:"$60.438.726.23",
      tokenChange:"20.19%",
      tokenPriceChart:"[W.I.P]",
      tokenVolume24h:"$20.645.726.23",
      tokenMarketCap:"$80.645.726.23",
      tokenSupply:"19M",
      tokenTrade:"CSPR"
    },
    {
      tokeName:"WCSPR-WETH",
      tokenPrice:"$60.438.726.23",
      tokenChange:"20.19%",
      tokenPriceChart:"[W.I.P]",
      tokenVolume24h:"$20.645.726.23",
      tokenMarketCap:"$80.645.726.23",
      tokenSupply:"19M",
      tokenTrade:"CSPR"
    },
    {
      tokeName:"WCSPR-WETH",
      tokenPrice:"$60.438.726.23",
      tokenChange:"20.19%",
      tokenPriceChart:"[W.I.P]",
      tokenVolume24h:"$20.645.726.23",
      tokenMarketCap:"$80.645.726.23",
      tokenSupply:"19M",
      tokenTrade:"CSPR"
    },
    {
      tokeName:"WCSPR-WETH",
      tokenPrice:"$60.438.726.23",
      tokenChange:"20.19%",
      tokenPriceChart:"[W.I.P]",
      tokenVolume24h:"$20.645.726.23",
      tokenMarketCap:"$80.645.726.23",
      tokenSupply:"19M",
      tokenTrade:"CSPR"
    },
    {
      tokeName:"WCSPR-WETH",
      tokenPrice:"$60.438.726.23",
      tokenChange:"20.19%",
      tokenPriceChart:"[W.I.P]",
      tokenVolume24h:"$20.645.726.23",
      tokenMarketCap:"$80.645.726.23",
      tokenSupply:"19M",
      tokenTrade:"CSPR"
    }
  ])
  const headers = [
    {
      Header: 'Name',
      accessor: 'tokeName',
    },
    {
      Header: 'Price',
      accessor: 'tokenPrice',
    },
    {
      Header: 'Change',
      accessor: 'tokenChange',
    },
    {
      Header: 'PriceChart',
      accessor: 'tokenPriceChart',
    },
    {
      Header: 'Volume (24hrs)',
      accessor: 'tokenVolume24h',
    },
    {
      Header: 'Market Cap',
      accessor: 'tokenMarketCap',
    },
    {
      Header: 'Supply',
      accessor: 'tokenSupply',
    },
    {
      Header: 'Trade',
      accessor: 'tokenTrade',
    }
  ]
  const columns = React.useMemo(() => headers, [])
  const data = React.useMemo(() => tokens, [])
  return (
    <TokensProviderContext2.Provider value={{ columns, data }}>
      {children}
    </TokensProviderContext2.Provider>
  )
}
