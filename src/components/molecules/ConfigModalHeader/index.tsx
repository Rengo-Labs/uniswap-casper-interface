import React, { ReactNode } from 'react'
import { HeaderStyled } from './styles'

export const ConfigModalHeader = ({ children }: { children: ReactNode }) => {
    return (
        <HeaderStyled>
            {children}
        </HeaderStyled>
    )
}
