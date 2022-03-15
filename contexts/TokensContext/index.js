import React, { createContext, useState } from 'react'
import casprIcon from '../../assets/swapIcons/casprIcon.png'
import wcasprIcon from '../../assets/swapIcons/wcasprIcon.png'
import wiseIcon from '../../assets/swapIcons/wiseIcon.png'
import wethIcon from '../../assets/swapIcons/wethIcon.svg'

export const TokensProviderContext = createContext(null)
export const TokensContext = ({ children }) => {

  const [tokens, setTokens] = useState(
    [
      {
        icon: casprIcon,
        fullname: {
          name: "Casper",
          acron: "CSPR"
        },
        amount: "0.0000"
      },
      {
        icon: wcasprIcon,
        fullname: {
          name: "Wrapped Casper",
          acron: "WCSPR"
        },
        amount: "0.0000"
      },
      {
        icon: wiseIcon,
        fullname: {
          name: "WISE-R",
          acron: "WISER"
        },
        amount: "0.0000"
      },
      {
        icon: wethIcon,
        fullname: {
          name: "Wrapped Ether",
          acron: "WETH"
        },
        amount: "0.0000"
      },
    ])
  return (
    <TokensProviderContext.Provider value={tokens}>
      {children}
    </TokensProviderContext.Provider>
  )
}
