import React from 'react'
import { AiOutlineCaretDown } from "react-icons/ai";

import { SwapTokenSelectStyled, SwapTokenChoiseStyled, SwapTokenBalanceStyled,SwapTokenRoundedImageStyled } from './styles'
export const SwapTokenSelect = ({ onClickHandler, token, isWalletConnected = false }:any) => {
  
  return (
    <SwapTokenSelectStyled>
      <SwapTokenChoiseStyled onClick={onClickHandler}>
        <SwapTokenRoundedImageStyled src={token.logoURI} width="30" height="30" alt=""/>
        <p>{token.symbol}</p>
        <AiOutlineCaretDown />
      </SwapTokenChoiseStyled>
      <SwapTokenBalanceStyled>
          {token.amount && isWalletConnected ? <p>Balance: {token.amount}</p> : <p>Balance: (wallet not connected)</p>}
      </SwapTokenBalanceStyled>
    </SwapTokenSelectStyled>
  )
}
