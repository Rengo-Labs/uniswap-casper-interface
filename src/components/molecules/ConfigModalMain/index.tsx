import React, { ReactNode } from 'react'
import { MainStyled } from './styles'

import { PillowDiv } from '../../atoms'

export const index = ({ children }: { children: ReactNode }) => {
    return (
        <MainStyled>
            <h1>Settings</h1>
            <PillowDiv>
                <WalletSelectionStyled isSelected={walletSelected === "casper" ? true : false} onClick={() => walletSelectedSet("casper")}>
                    <WalletSelectionImageStyled src={casperWallet.src} alt="" />
                    <h2>Casper Wallet</h2>
                </WalletSelectionStyled>
                <WalletSelectionStyled isSelected={walletSelected === "torus" ? true : false} onClick={() => walletSelectedSet("torus")}>
                    <WalletSelectionImageStyled src={torusWallet.src} alt="" />
                    <h2>Torus Wallet</h2>
                </WalletSelectionStyled>
            </PillowDiv>
            <PillowDiv>
                Language Selection
            </PillowDiv>
            <PillowDiv>
                Visual Mode
            </PillowDiv>
            <PillowDiv>
                Slippage Tolerance
            </PillowDiv>
            <PillowDiv>
                Transaction Speed
            </PillowDiv>
        </MainStyled>
    )
}
