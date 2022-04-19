import React, { ReactNode } from 'react'
import { WalletSelectionStyled } from './styles'

interface WalletSelectionDivInterfaceProps {
    walletSelected: string,
    children: ReactNode
}

export const WalletSelectionDiv = ({ walletSelected, children }: WalletSelectionDivInterfaceProps) => {
    return (
        <WalletSelectionStyled isSelected={walletSelected === "casper" ? true : false} >
            {children}
        </WalletSelectionStyled>
    )
}
