import React, { useEffect } from 'react'
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

import { useCasper } from '@customHooks/useCasperSign';


import { ConfigModalHeader } from '@molecules/ConfigModalHeader';
import { ButtonClose } from '@atoms/ButtonClose';
import { ButtonConnection } from '@atoms/ButtonConnection';


export const ConfigModal = ({ children }: { children?}) => {
    const {
        signerLocked,
        signerLockedSetter,
        signerConnected,
        signerConnectedSetter,
        activePublicKey,
        activePublicKeySetter,
        getActiveKeyFromSigner,
        checkConnection,
        connectToSigner,
        disconnectToSigner
    } = useCasper()

    useEffect(() => {

        // ['signer:connected', 'signer:disconnected', 'signer:tabUpdated', 'signer:activeKeyChanged', 'signer:locked', 'signer:unlocked', 'signer:initialState']
        //     .map((x) => {
        //         window.addEventListener(x, function (event) {
        //             event.stopImmediatePropagation();
        //         }, true);
        //     })
        // shortcut to erase events

        window.addEventListener('signer:connected', (msg: any) => {
            console.log('signer:connected')
            signerLockedSetter(!msg.detail.isUnlocked)
            signerConnectedSetter(true)
            activePublicKeySetter(msg.detail.activeKey)
        });

        window.addEventListener('signer:disconnected', (msg: any) => {
            console.log('signer:disconnected')
            signerLockedSetter(!msg.detail.isUnlocked)
            signerConnectedSetter(false)
            activePublicKeySetter(msg.detail.activeKey)
        })
        window.addEventListener('signer:tabUpdated', (msg: any) => {
            console.log('signer:tabUpdated')
            signerLockedSetter(!msg.detail.isUnlocked)
            signerConnectedSetter(msg.detail.isConnected)
            activePublicKeySetter(msg.detail.activeKey)
        })
        window.addEventListener('signer:activeKeyChanged', (msg: any) => {
            console.log('signer:activeKeyChanged')
            activePublicKeySetter(msg.detail.activeKey)
        });
        window.addEventListener('signer:locked', (msg: any) => {
            console.log('signer:locked')
            signerLockedSetter(!msg.detail.isUnlocked);
            activePublicKeySetter(msg.detail.activeKey)
        });
        window.addEventListener('signer:unlocked', (msg: any) => {
            console.log('signer:unlocked')
            signerLockedSetter(!msg.detail.isUnlocked)
            signerConnectedSetter(msg.detail.isConnected)
            activePublicKeySetter(msg.detail.activeKey)
        });
        window.addEventListener('signer:initialState', (msg: any) => {
            console.log("Initial State: ", msg.detail);
            signerLockedSetter(!msg.detail.isUnlocked)
            signerConnectedSetter(msg.detail.isConnected)
            activePublicKeySetter(msg.detail.activeKey)
        });
    }, []);



    const [openModal, openModalSet] = useAtom(setConfig)
    const [walletSelected, walletSelectedSet] = useAtom(walletAtom)

    async function connectionHandler(isConnected) {
        if (isConnected) {
            await disconnectToSigner()
        } else {
            await getActiveKeyFromSigner()
            console.log(activePublicKey)
        }
    }

    return (
        <ModalStyled openModal={openModal}>
            <ContainerStyled>
                <ContentStyled>
                    <ConfigModalHeader>
                        <AiOutlineUser />
                        <ButtonConnection isConnected={signerConnected} connectionHandler={connectionHandler} activePublicKey={activePublicKey} />
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
function setPosition(newPos: GeolocationPosition): void {
    throw new Error('Function not implemented.');
}

