import React, { ReactNode } from 'react'
import { SwapContainerStyled } from './styles'

export const SwapContainerAtom = ({ children }: { children: ReactNode }) => {
    return (
        <SwapContainerStyled>{ children }</SwapContainerStyled>
    )
}
