import React, { createContext, useState } from 'react'
import casprIcon from '../../assets/swapIcons/casprIcon.png'
import wcasprIcon from '../../assets/swapIcons/wcasprIcon.png'
import wiseIcon from '../../assets/swapIcons/wiseIcon.png'
import wethIcon from '../../assets/swapIcons/wethIcon.svg'

export const LiquidityProviderContext = createContext(null)
export const LiquidityContext = ({ children }) => {

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
  
  const [primaryToken, setPrimaryToken] = useState(tokens[0])
  const [secondaryToken, setSecondaryToken] = useState(tokens[1])
  const switchTokens = () => {
    setPrimaryToken(secondaryToken)
    setSecondaryToken(primaryToken)
  }
  const [filterCriteria,filterCriteriaSet] = useState("")
  const fileteredTokens = tokens.filter(token => token.fullname.acron.toLowerCase().includes(filterCriteria.toLowerCase()))
  return (
    <LiquidityProviderContext.Provider value={{ tokens,fileteredTokens,filterCriteriaSet,filterCriteria, primaryToken, secondaryToken, switchTokens,setPrimaryToken,setSecondaryToken }}>
      {children}
    </LiquidityProviderContext.Provider>
  )
}
