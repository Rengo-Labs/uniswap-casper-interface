import React, { useState } from 'react'



import { SwapTokenBalanceStyled,RoundedButtonStyled,InputStyled } from './styles'

export const SwapTokenBalance = ({token,amoutSwapTokenSetter}) => {
  const [max,maxSetter] = useState("")
  return (
    <SwapTokenBalanceStyled>
      <InputStyled type='number' placeholder="0.0001" defaultValue={max} onChange={(e)=>{amoutSwapTokenSetter(e.target.value)}}/>
      <RoundedButtonStyled onClick={()=>{maxSetter(token.amount)}}>MAX</RoundedButtonStyled>
    </SwapTokenBalanceStyled>
  )
}
