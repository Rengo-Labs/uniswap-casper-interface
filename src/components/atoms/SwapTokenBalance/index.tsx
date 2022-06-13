import React, { useState } from 'react'



import { SwapTokenBalanceStyled, RoundedButtonStyled, InputStyled } from './styles'

export const SwapTokenBalance = ({ token, amoutSwapTokenSetter, disabled = false, amoutSwapToken = 1 }) => {
  const [max, maxSetter] = useState("")
  return (
    <SwapTokenBalanceStyled>
      {!disabled &&
        <InputStyled type='number' disabled={disabled} placeholder="0.0001" onChange={(e) => { amoutSwapTokenSetter(e.target.value) }} />}

      {disabled &&
        <InputStyled type='number' disabled value={amoutSwapToken} onChange={(e) => { amoutSwapTokenSetter(e.target.value) }} />}
      <RoundedButtonStyled onClick={() => { maxSetter(token.amount) }} style={{ display: `${disabled && "none"}` }}>MAX</RoundedButtonStyled>
    </SwapTokenBalanceStyled>
  )
}
