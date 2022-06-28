import React, { ReactNode } from 'react'
import { WalletSelectionStyled } from './styles'

interface WalletSelectionDivInterfaceProps {
    walletSelected: string,
    children: ReactNode,
    onClick:any
}

export const WalletSelectionDiv = ({ walletSelected, children, onClick}: WalletSelectionDivInterfaceProps) => {
    return (
        <WalletSelectionStyled isSelected={walletSelected === "casper" ? false : false} onClick={onClick}>
            {children}
        </WalletSelectionStyled>
    )
}
