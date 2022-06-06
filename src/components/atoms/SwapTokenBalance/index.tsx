import React, { useState } from 'react'



import { SwapTokenBalanceStyled,RoundedButtonStyled,InputStyled } from './styles'

export const SwapTokenBalance = ({token,amoutSwapTokenSetter,disabled=false}) => {
  const [max,maxSetter] = useState("")
  return (
    <SwapTokenBalanceStyled>
      <InputStyled type='number' disabled={disabled} placeholder="0.0001" defaultValue={max} onChange={(e)=>{amoutSwapTokenSetter(e.target.value)}}/>
      <RoundedButtonStyled onClick={()=>{maxSetter(token.amount)}} style={{display:`${disabled && "none"}`}}>MAX</RoundedButtonStyled>
    </SwapTokenBalanceStyled>
  )
}
