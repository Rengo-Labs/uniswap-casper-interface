import React, { createContext, useState } from 'react'
import casprIcon from '../../assets/swapIcons/casprIcon.png'

export const PoolsProviderContext = createContext(null)
export const PoolsContext = ({ children }) => {

  const [tokens, setTokens] = useState([
      {
        icon: casprIcon,
        name: "WETH-CSPR",
        liquidity: "$78.438.726.23",
        volume24h: "$11.645.726.23",
        volume7dh: "$20.666.726.23",
        fees24h: "$10.438.726.23",
        oneYFees: "13.19%",
      },
      {
        icon: casprIcon,
        name: "WETH-CSPR",
        liquidity: "$78.438.726.23",
        volume24h: "$11.645.726.23",
        volume7dh: "$20.666.726.23",
        fees24h: "$10.438.726.23",
        oneYFees: "13.19%",
      },
      {
        icon: casprIcon,
        name: "WETH-CSPR",
        liquidity: "$78.438.726.23",
        volume24h: "$11.645.726.23",
        volume7dh: "$20.666.726.23",
        fees24h: "$10.438.726.23",
        oneYFees: "13.19%",
      },
      {
        icon: casprIcon,
        name: "WETH-CSPR",
        liquidity: "$78.438.726.23",
        volume24h: "$11.645.726.23",
        volume7dh: "$20.666.726.23",
        fees24h: "$10.438.726.23",
        oneYFees: "13.19%",
      },
      {
        icon: casprIcon,
        name: "WETH-CSPR",
        liquidity: "$78.438.726.23",
        volume24h: "$11.645.726.23",
        volume7dh: "$20.666.726.23",
        fees24h: "$10.438.726.23",
        oneYFees: "13.19%",
      },
      {
        icon: casprIcon,
        name: "WETH-CSPR",
        liquidity: "$78.438.726.23",
        volume24h: "$11.645.726.23",
        volume7dh: "$20.666.726.23",
        fees24h: "$10.438.726.23",
        oneYFees: "13.19%",
      }
    ])
  
  const [filterCriteria,filterCriteriaSet] = useState("")
  const fileteredTokens = tokens.filter(token => token.name.toLowerCase().includes(filterCriteria.toLowerCase()))
  return (
    <PoolsProviderContext.Provider value={{ fileteredTokens,filterCriteriaSet,filterCriteria }}>
      {children}
    </PoolsProviderContext.Provider>
  )
}
