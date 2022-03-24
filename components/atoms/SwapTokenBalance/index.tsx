import React from 'react'



import { SwapTokenBalanceStyled,RoundedButtonStyled,InputStyled } from './styles'

export const SwapTokenBalance = () => {
  return (
    <SwapTokenBalanceStyled>
      <InputStyled type='number' placeholder="0.0001" />
      <RoundedButtonStyled>MAX</RoundedButtonStyled>
    </SwapTokenBalanceStyled>
  )
}
