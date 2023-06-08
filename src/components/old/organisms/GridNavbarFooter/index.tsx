import React from 'react'
import { NavBarFooterStyle } from './styles'
export const GridNavbarFooter = ({ children }) => {
    return (
        <NavBarFooterStyle>
            { children }
        </NavBarFooterStyle>
    )
}
