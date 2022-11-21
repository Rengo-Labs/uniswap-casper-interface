import React, { ReactNode } from 'react'
import { WalletSelectionStyled } from './styles'

interface WalletSelectionDivInterfaceProps {
    isSelected: boolean,
    children: ReactNode,
    onClick:any,
    style:any
}

export const WalletSelectionDiv = ({ 
    isSelected, 
    children, 
    onClick,
    style
}: WalletSelectionDivInterfaceProps) => {
    return (
        <WalletSelectionStyled isSelected={isSelected} onClick={onClick} style={style}>
            {children}
        </WalletSelectionStyled>
    )
}
