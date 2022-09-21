import React, { ReactNode } from 'react'
import { WalletSelectionStyled } from './styles'

interface WalletSelectionDivInterfaceProps {
    walletSelected: string,
    children: ReactNode,
    onClick:any,
    style:any
}

export const WalletSelectionDiv = ({ walletSelected, children, onClick,style}: WalletSelectionDivInterfaceProps) => {
    return (
        <WalletSelectionStyled isSelected={walletSelected === "casper" ? false : false} onClick={onClick} style={style}>
            {children}
        </WalletSelectionStyled>
    )
}
