import React from 'react'
import { AiOutlineCaretDown } from "react-icons/ai";

import { SwapTokenSelectStyled, SwapTokenChoiseStyled, SwapTokenBalanceStyled } from './styles'
export const SwapTokenSelect = ({ onClickHandler, balance, token }) => {
  
  return (
    <SwapTokenSelectStyled>
      <SwapTokenChoiseStyled onClick={onClickHandler}>
        <img src={token.icon.src} width="30" height="30" alt=""/>
        <p>{token.fullname.acron}</p>
        <AiOutlineCaretDown />
      </SwapTokenChoiseStyled>
      <SwapTokenBalanceStyled>
        {balance ? <p>balance: {balance}</p> : ""}
      </SwapTokenBalanceStyled>
    </SwapTokenSelectStyled>
  )
}
