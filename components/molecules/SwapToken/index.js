import React from 'react'

import { SwapTokenStyled, SwapAmountStyled, SwapIconStyled, SwapNamingStyled,SwapIconImageStyled } from './styles'

export const SwapToken = ({ icon, token, amount }) => {
    return (
        <SwapTokenStyled>
            <SwapIconStyled><SwapIconImageStyled src={icon} width="50" height="50"/></SwapIconStyled>
            <SwapNamingStyled>
                <p>{token.name}</p>
                <p>{token.acron}</p>
            </SwapNamingStyled>
            <SwapAmountStyled>{amount}</SwapAmountStyled>
        </SwapTokenStyled>
    )
}
