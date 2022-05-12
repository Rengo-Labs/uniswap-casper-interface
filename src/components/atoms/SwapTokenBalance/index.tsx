import React, { useState } from 'react'



import { SwapTokenBalanceStyled,RoundedButtonStyled,InputStyled } from './styles'

export const SwapTokenBalance = ({token}) => {
  const [max,maxSetter] = useState("")
  return (
    <SwapTokenBalanceStyled>
      <InputStyled type='number' placeholder="0.0001" value={max}/>
      <RoundedButtonStyled onClick={()=>{maxSetter(token.amount)}}>MAX</RoundedButtonStyled>
    </SwapTokenBalanceStyled>
  )
}
