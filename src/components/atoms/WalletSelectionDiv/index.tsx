import React from 'react'
import { WalletSelectionImageStyled, WalletSelectionStyled } from './styles'

interface WalletSelectionDivInterfaceProps {
    walletSelected: string,
    walletImage: string,
    walletSelectedSet: (walletSelected: string) => void,
}

export const WalletSelectionDiv = ({ walletSelected, walletImage, walletSelectedSet }: WalletSelectionDivInterfaceProps) => {
    return (
        <WalletSelectionStyled isSelected={walletSelected === "casper" ? true : false} onClick={() => walletSelectedSet("casper")}>
            <WalletSelectionImageStyled src={walletImage} alt="" />
            <h2>Casper Wallet</h2>
        </WalletSelectionStyled>
    )
}
