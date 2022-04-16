import React from 'react'
import { HeaderStyled } from './styles'

export const ConfigModalHeader = ({ children }) => {
    return (
        <HeaderStyled>
            {children}
        </HeaderStyled>
    )
}
