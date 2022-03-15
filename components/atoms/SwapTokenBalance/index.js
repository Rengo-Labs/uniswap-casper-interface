import React from 'react'

import { SwapTokenBalanceStyled } from './styles'
export const SwapTokenBalance = () => {
  return (
    <SwapTokenBalanceStyled>
      <input placeholder="0.0001" />
      <button>MAX</button>
    </SwapTokenBalanceStyled>
  )
}
