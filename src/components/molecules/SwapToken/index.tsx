import React from 'react'

import { SwapTokenStyled, SwapIconStyled, SwapNamingStyled, SwapIconImageStyled } from './styles'

export const SwapToken = ({ token, handleToken }) => {
    return (
        <SwapTokenStyled onClick={()=>{handleToken()}}>
            <SwapIconStyled>
                <SwapIconImageStyled src={token.logoURI} width="50" height="50" />
            </SwapIconStyled>
            <SwapNamingStyled>
                <p>{token.symbol}</p>
            </SwapNamingStyled>
        </SwapTokenStyled>
    )
}
