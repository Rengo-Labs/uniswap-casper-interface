import React from 'react'

import { SwapTokenStyled, SwapIconStyled, SwapNamingStyled, SwapIconImageStyled } from './styles'

export const SwapToken = ({ icon, token, amount,setToken,handleModal }) => {
    return (
        <SwapTokenStyled onClick={()=>{setToken(token); handleModal() }}>
            <SwapIconStyled>
                <SwapIconImageStyled src={icon} width="50" height="50" />
            </SwapIconStyled>
            <SwapNamingStyled>
                <p>{token.fullname.acron}</p>
            </SwapNamingStyled>
        </SwapTokenStyled>
    )
}
