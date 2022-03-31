import React from 'react'
import { useAtom } from 'jotai'

import { Button } from '../../atoms'

import casperWallet from '../../../assets/walletIcons/casper.png';
import torusWallet from '../../../assets/walletIcons/torus.png';

import {
    ModalStyled,
    ContainerStyled,
    ContentStyled,
    HeaderStyled,
    MainStyled,
    PillowStyled,
    WalletSelectionStyled,
    WalletSelectionImageStyled,
    ButtonStyle,
    ButtonCloseStyle
} from './styles'

import { setConfig } from '../../../contexts/ConfigAtom'
import { AiOutlineUser } from "react-icons/ai";


export const ConfigModal = ({ children }: { children?}) => {
    const [openModal, openModalSet] = useAtom(setConfig)

    return (
        <ModalStyled openModal={openModal}>
            <ContainerStyled>
                <ContentStyled>
                    <HeaderStyled>
                        <AiOutlineUser></AiOutlineUser>
                        <ButtonStyle >Connect Wallet</ButtonStyle>
                        <ButtonCloseStyle onClick={() => { openModalSet() }}>X</ButtonCloseStyle>
                    </HeaderStyled>
                    <MainStyled>
                        <h1>Settings</h1>
                        <PillowStyled>
                            <WalletSelectionStyled>
                                <WalletSelectionImageStyled src={casperWallet.src} alt="" />
                                <h2>Casper Wallet</h2>
                            </WalletSelectionStyled>
                            <WalletSelectionStyled>
                                <WalletSelectionImageStyled src={torusWallet.src} alt="" />
                                <h2>Torus Wallet</h2>
                            </WalletSelectionStyled>
                        </PillowStyled>
                        <PillowStyled>
                            Language Selection
                        </PillowStyled>
                        <PillowStyled>
                            Visual Mode
                        </PillowStyled>
                        <PillowStyled>
                            Slippage Tolerance
                        </PillowStyled>
                        <PillowStyled>
                            Transaction Speed
                        </PillowStyled>
                    </MainStyled>
                    <MainStyled>
                        <h1>Favorites</h1>
                        <PillowStyled>
                            <WalletSelectionStyled>
                                <WalletSelectionImageStyled src={casperWallet.src} alt="" />
                                <h2>Casper</h2>
                            </WalletSelectionStyled>
                        </PillowStyled>
                    </MainStyled>
                    {children}
                </ContentStyled>
            </ContainerStyled>
        </ModalStyled>
    )
}
