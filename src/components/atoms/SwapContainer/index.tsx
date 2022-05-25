import React, { ReactNode } from 'react'
import { SwapContainerStyled } from './styles'
export const SwapContainer = ({ children }:{ children:ReactNode }) => {
    return (
        <SwapContainerStyled>
            {children}
        </SwapContainerStyled>
    )
}
