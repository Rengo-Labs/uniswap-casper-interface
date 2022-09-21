import React, { ReactNode } from 'react'
import { SwapModulesStyled } from './styles'

export const SwapModule = ({ children }: { children: ReactNode }) => {
    return (
        <SwapModulesStyled>
            {children}
        </SwapModulesStyled>
    )
}
