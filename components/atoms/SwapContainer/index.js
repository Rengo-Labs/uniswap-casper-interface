import React from 'react'
import { SwapContainerStyled } from './styles'
export const SwapContainer = ({ children }) => {
    return (
        <SwapContainerStyled>
            {children}
        </SwapContainerStyled>
    )
}
