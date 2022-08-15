import React, { useState } from 'react'



import { SwapTokenBalanceStyled, RoundedButtonStyled, InputStyled, ButtonContainerStyled } from './styles'

export const SwapTokenBalance = ({ token, amountSwapToken, amountSwapTokenSetter }:any) => {
  const [max, setMax] = useState<any>("")

  function maxSetter() {
    amountSwapTokenSetter(token.amount)
    setMax(token.amount)
  }

  function halfSetter() {
    amountSwapTokenSetter(token.amount / 2)
    setMax(token.amount / 2)
  }

  function onChange(e) {
    amountSwapTokenSetter(e.target.value)
    setMax(e.target.value)
  }

  return (
    <SwapTokenBalanceStyled>
      <InputStyled type='number' value={amountSwapToken} onChange={onChange} />
      <ButtonContainerStyled>
        <RoundedButtonStyled onClick={maxSetter}>MAX</RoundedButtonStyled>
        <RoundedButtonStyled onClick={halfSetter}>HALF</RoundedButtonStyled>
      </ButtonContainerStyled>
    </SwapTokenBalanceStyled>
  )
}
