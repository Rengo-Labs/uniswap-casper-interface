import React from 'react'
import { AiOutlineCaretDown } from "react-icons/ai";

import { SwapTokenSelectStyled, SwapTokenChoiseStyled, SwapTokenBalanceStyled,SwapTokenRoundedImageStyled } from './styles'
export const SwapTokenSelect = ({ onClickHandler, balance="000000.1", token }:any) => {
  
  return (
    <SwapTokenSelectStyled>
      <SwapTokenChoiseStyled onClick={onClickHandler}>
        <SwapTokenRoundedImageStyled src={token.icon} width="30" height="30" alt=""/>
        <p>{token.fullname.acron}</p>
        <AiOutlineCaretDown />
      </SwapTokenChoiseStyled>
      <SwapTokenBalanceStyled>
        {balance ? <p>Balance: {balance}</p> : ""}
      </SwapTokenBalanceStyled>
    </SwapTokenSelectStyled>
  )
}
