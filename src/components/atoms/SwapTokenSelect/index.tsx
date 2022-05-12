import React from 'react'
import { AiOutlineCaretDown } from "react-icons/ai";

import { SwapTokenSelectStyled, SwapTokenChoiseStyled, SwapTokenBalanceStyled,SwapTokenRoundedImageStyled } from './styles'
export const SwapTokenSelect = ({ onClickHandler, token }:any) => {
  
  return (
    <SwapTokenSelectStyled>
      <SwapTokenChoiseStyled onClick={onClickHandler}>
        <SwapTokenRoundedImageStyled src={token.icon} width="30" height="30" alt=""/>
        <p>{token.fullname.acron}</p>
        <AiOutlineCaretDown />
      </SwapTokenChoiseStyled>
      <SwapTokenBalanceStyled>
        {token.amount ? <p>Balance: {token.amount}</p> : ""}
      </SwapTokenBalanceStyled>
    </SwapTokenSelectStyled>
  )
}
