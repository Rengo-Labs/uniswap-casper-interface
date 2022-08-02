import React, { useState } from 'react'



import { SwapTokenBalanceStyled, RoundedButtonStyled, InputStyled,ButtonContainerStyled } from './styles'

export const SwapTokenBalance = ({ token, amoutSwapTokenSetter, disabled = false, amoutSwapToken = 1 }) => {
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
      {!disabled &&
        <InputStyled type='number' value={max} disabled placeholder="0.0001" onChange={onChange} />}

      {disabled &&
        <InputStyled type='number' disabled value={amoutSwapToken} onChange={onChange} />}
      <ButtonContainerStyled>
        <RoundedButtonStyled onClick={maxSetter} style={{ display: `${disabled && "none"}` }}>MAX</RoundedButtonStyled>
        <RoundedButtonStyled onClick={halfSetter} style={{ display: `${disabled && "none"}` }}>HALF</RoundedButtonStyled>
      </ButtonContainerStyled>
    </SwapTokenBalanceStyled>
  )
}
