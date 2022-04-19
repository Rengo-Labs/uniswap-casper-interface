import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import casperWallet from '../../../assets/walletIcons/casper.png';
import torusWallet from '../../../assets/walletIcons/torus.png';

import {
    ModalStyled,
    ContainerStyled,
    ContentStyled,
    WalletSelectionImageStyled,
} from './styles'
import { AiOutlineUser, AiOutlineCloseCircle } from "react-icons/ai";


import { setConfig, walletAtom, } from '../../../contexts/ConfigAtom'


import { ConfigModalHeader } from '../../molecules';
import { ButtonClose, ButtonConnection, ConfigModalBody, PillowDiv, WalletSelectionDiv } from '../../atoms';


export const ConfigModal = ({ children }: { children?: ReactNode }) => {


    const [openModal, openModalSet] = useAtom(setConfig)
    const [walletSelected, walletSelectedSet] = useAtom(walletAtom)

    // const [publicAddress, setPublicAddress] = useAtom(publicAddressAtom);

    // useEffect(() => {
    //     const initialize = async () => {
    //         const torus = (await import("@toruslabs/solana-embed")).default;
    //         web3Obj.torus = new Torus({});
    //     }
    //     initialize();
    // }, [])


    return (
        <ModalStyled openModal={openModal}>
            <ContainerStyled>
                <ContentStyled>
                    <ConfigModalHeader>
                        <AiOutlineUser />
                        <ButtonConnection isConnected={false} onConnect={() => { console.log() }} onDisconnect={() => { console.log("disconnect") }} />
                        <ButtonClose onClickHandler={openModalSet}>
                            <AiOutlineCloseCircle />
                        </ButtonClose>
                    </ConfigModalHeader>
                    <ConfigModalBody>
                        <h1>Settings</h1>
                        <PillowDiv>
                            <WalletSelectionDiv walletSelected={"walletSelected"} >
                                <WalletSelectionImageStyled src={casperWallet} alt="" />
                                <h2>Casper Wallet</h2>
                            </WalletSelectionDiv>
                            <WalletSelectionDiv walletSelected={"walletSelected"} >
                                <WalletSelectionImageStyled src={casperWallet} alt="" />
                                <h2>Torus Wallet</h2>
                            </WalletSelectionDiv>
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
                    </ConfigModalBody>
                    <ConfigModalBody>
                        <h1>Favorites</h1>
                        <PillowDiv>
                            <WalletSelectionDiv walletSelected={"walletSelected"} >
                                <WalletSelectionImageStyled src={casperWallet} alt="" />
                                <h2>Casper</h2>
                            </WalletSelectionDiv>
                        </PillowDiv>
                    </ConfigModalBody>
                    {children}
                </ContentStyled>
            </ContainerStyled>
        </ModalStyled>
    )
}
