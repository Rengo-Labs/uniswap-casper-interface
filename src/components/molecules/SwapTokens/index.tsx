import React, { ReactNode } from 'react'
import { SwapToken } from '../SwapToken'
import { TokensStyled } from './styles'
export const SwapTokens = ({ children }:{children:ReactNode}) => {
    return (
        <TokensStyled>
            { children }
        </TokensStyled>
    )
}
