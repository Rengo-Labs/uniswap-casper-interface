import React, { ReactNode } from 'react'
import { PillowStyled } from './styles'

export const PillowDiv = ({ children }: { children: ReactNode }) => {
    return (
        <PillowStyled>
            {children}
        </PillowStyled>
    )
}
