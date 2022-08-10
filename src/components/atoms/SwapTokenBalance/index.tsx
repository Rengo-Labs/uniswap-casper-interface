import React, { useState } from 'react'



import { SwapTokenBalanceStyled, RoundedButtonStyled, InputStyled, ButtonContainerStyled } from './styles'

export const SwapTokenBalance = ({ token, amoutSwapToken, amoutSwapTokenSetter }:any) => {
  const [max, setMax] = useState<any>("")

  function maxSetter() {
    amoutSwapTokenSetter(token.amount)
    setMax(token.amount)
  }

  function halfSetter() {
    amoutSwapTokenSetter(token.amount / 2)
    setMax(token.amount / 2)
  }

  function onChange(e) {
    amoutSwapTokenSetter(e.target.value)
    setMax(e.target.value)
  }

  return (
    <SwapTokenBalanceStyled>
      <InputStyled type='number' value={amoutSwapToken} onChange={onChange} />
      <ButtonContainerStyled>
        <RoundedButtonStyled onClick={maxSetter}>MAX</RoundedButtonStyled>
        <RoundedButtonStyled onClick={halfSetter}>HALF</RoundedButtonStyled>
      </ButtonContainerStyled>
    </SwapTokenBalanceStyled>
  )
}
