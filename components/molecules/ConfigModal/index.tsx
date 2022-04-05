import React, { useEffect } from 'react'
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

import { setConfig, walletAtom, } from '../../../contexts/ConfigAtom'
import { connectToSigner, signerConnected, checkConnection, disconnectWallet } from '../../../contexts/CasperAtoms'
import { AiOutlineUser, AiOutlineCloseCircle } from "react-icons/ai";


export const ConfigModal = ({ children }: { children?}) => {
    const [, checkConnectionSetter] = useAtom(checkConnection)
    const [isConnected,isConnectedSetter] = useAtom(signerConnected)
    const [, disconnectWalletSetter] = useAtom(disconnectWallet)

    useEffect(() => {
        checkConnectionSetter()
    }, [])

    const [openModal, openModalSet] = useAtom(setConfig)
    const [walletSelected, walletSelectedSet] = useAtom(walletAtom)


    return (
        <ModalStyled openModal={openModal}>
            <ContainerStyled>
                <ContentStyled>
                    <HeaderStyled>
                        <AiOutlineUser />
                        {isConnected ? <ButtonStyle isSelected={isConnected} onClick={async () => { await disconnectWalletSetter(),isConnectedSetter(false) }}>Disconnect Wallet</ButtonStyle> : <ButtonStyle isSelected={isConnected} onClick={async () => { await connectToSigner(),isConnectedSetter(true) }}>Connect Wallet</ButtonStyle>}
                        <ButtonCloseStyle onClick={() => { openModalSet() }}><AiOutlineCloseCircle /></ButtonCloseStyle>
                    </HeaderStyled>
                    <MainStyled>
                        <h1>Settings</h1>
                        <PillowStyled>
                            <WalletSelectionStyled isSelected={walletSelected === "casper" ? true : false} onClick={() => walletSelectedSet("casper")}>
                                <WalletSelectionImageStyled src={casperWallet.src} alt="" />
                                <h2>Casper Wallet</h2>
                            </WalletSelectionStyled>
                            <WalletSelectionStyled isSelected={walletSelected === "torus" ? true : false} onClick={() => walletSelectedSet("torus")}>
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
