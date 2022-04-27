import React, { ReactNode, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { useAtom } from 'jotai'
import casperWallet from '../../../assets/walletIcons/casper.png';
import torusWallet from '../../../assets/walletIcons/torus-icon-blue-3.svg';

import {
    ModalStyled,
    ContainerStyled,
    ContentStyled,
    WalletSelectionImageStyled,
} from './styles'
import { AiOutlineUser, AiOutlineCloseCircle } from "react-icons/ai";


import { setConfig, walletAtom, } from '../../../contexts/ConfigAtom'

import { ButtonClose, ButtonConnection, ConfigModalBody, PillowDiv, WalletSelectionDiv } from '../../atoms';
import { ConfigModalHeader } from '../../molecules';
import { SwapProviderContext } from '../../../contexts/SwapContext';
import { torusLogin, torusLogout } from '../../../reducers/WalletReducers/functions';


export const ConfigModal = ({ children }: { children?: ReactNode }) => {


    const [openModal, openModalSet] = useAtom(setConfig)
    const { swapState, swapDispatch } = useContext(SwapProviderContext)
    const { isUserLogged, walletAddress, profileImage } = swapState

    async function onConnect() {
        const { torus, walletAddress, profileImage } = await torusLogin()
        swapDispatch({ type: 'LOGIN', payload: { torus, walletAddress, profileImage } })
    }

    function onDisconnect() {
        swapDispatch({ type: 'LOGOUT' })
    }

    return (
        <ModalStyled openModal={openModal}>
            <ContainerStyled>
                <ContentStyled>
                    <ConfigModalHeader>
                        {isUserLogged && <WalletSelectionImageStyled src={profileImage} />}
                        {!isUserLogged && <AiOutlineUser />}
                        <ButtonConnection isConnected={isUserLogged} onConnect={onConnect} onDisconnect={onDisconnect} Account={walletAddress} />
                        <ButtonClose onClickHandler={openModalSet}>
                            <AiOutlineCloseCircle />
                        </ButtonClose>
                    </ConfigModalHeader>
                    <ConfigModalBody>
                        <h1>Settings</h1>
                        <PillowDiv>
                            <WalletSelectionDiv walletSelected={"walletSelected"} >
                                <WalletSelectionImageStyled src={torusWallet} alt="" />
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
