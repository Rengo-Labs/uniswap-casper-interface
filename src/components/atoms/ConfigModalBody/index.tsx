import React, { ReactNode } from 'react'
import { MainStyled } from './styles'

export const ConfigModalBody = ({ children }: { children: ReactNode }) => {
    return (
        <MainStyled>{children}</MainStyled>
    )
}
