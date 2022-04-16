import React, { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import casperWallet from '../../../assets/walletIcons/casper.png';
import torusWallet from '../../../assets/walletIcons/torus.png';

import {
    ModalStyled,
    ContainerStyled,
    ContentStyled,
    MainStyled,
    PillowStyled,
    WalletSelectionStyled,
    WalletSelectionImageStyled,
} from './styles'
import { AiOutlineUser, AiOutlineCloseCircle } from "react-icons/ai";


import { setConfig, walletAtom, } from '../../../contexts/ConfigAtom'


import { ConfigModalHeader } from '@molecules/ConfigModalHeader';
import { ButtonClose } from '@atoms/ButtonClose';
import { ButtonConnection } from '@atoms/ButtonConnection';
import { torusLogin, web3Obj } from './torus';
import { publicAddressAtom } from 'contexts/TorusAtoms';
import Torus from "@toruslabs/casper-embed";


export const ConfigModal = ({ children }: { children?}) => {


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
