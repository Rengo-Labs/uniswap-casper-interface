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
import { Signer } from 'casper-js-sdk'
import { clientDispatcher, signerLogIn, getActivePublicKey } from '../../../reducers/WalletReducers/signerFunctions';

import Torus from "@toruslabs/casper-embed";


import styled from "styled-components";
import { CHAINS, SUPPORTED_NETWORKS } from '../../../constant';
import { WalletController } from '../../../commons';

export const ButtonStyle = styled.button<any>`
    color: ${props => props.theme.StrongColor};
    background-color: ${props => props.theme.TertiaryColor};
    width: 100%;
    border-radius: 10px;
    border:none;
    box-shadow: 0 0 1rem .2rem rgba(0,0,0,.3);
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow: ellipsis;
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.TertiaryColor2};
    }
    `
export const ConfigModal = ({ children }: { children?: ReactNode }) => {

    const [openModal, openModalSet] = useAtom(setConfig)
    const { swapState, swapDispatch } = useContext(SwapProviderContext)
    const { isUserLogged, walletAddress, slippageTolerance } = swapState
    const [walletSelect, walletSelectSetter] = useState('casper')
    const walletSelector = new WalletController()
    let torus;
    function switchWallet(walletName) {

        walletSelector.switchWallet()
    }
    async function onConnect() {
        const walletAddress = await walletSelector.connect()
        swapDispatch({ type: 'LOGIN', payload: { walletAddress, casperService: clientDispatcher() } })

    }

    function onSetSlippage(slippage) {
        swapDispatch({ type: 'SLIPPAGE_TOLERANCE_SETTER', payload: { slippageTolerance: slippage } })
    }

    async function onDisconnect() {
        await walletSelector.disconnect()
        swapDispatch({ type: 'LOGOUT' })
    }

    return (
        <ModalStyled openModal={openModal}>
            <ContainerStyled>
                <ContentStyled>
                    <ConfigModalHeader>
                        <AiOutlineUser />
                        <ButtonConnection isConnected={isUserLogged} onConnect={onConnect} onDisconnect={onDisconnect} Account={walletAddress} />
                        <ButtonClose onClickHandler={openModalSet}>
                            <AiOutlineCloseCircle />
                        </ButtonClose>
                    </ConfigModalHeader>
                    <ConfigModalBody>
                        <h1>Settings</h1>
                        <PillowDiv>
                            <WalletSelectionDiv walletSelected={"walletSelected"} onClick={() => { switchWallet("casper") }}>
                                <WalletSelectionImageStyled src={casperWallet} alt="" />
                                <h2>Signer Wallet</h2>
                            </WalletSelectionDiv>
                            <WalletSelectionDiv walletSelected={"walletSelected"} onClick={() => { switchWallet("torus") }}>
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
                            <ButtonStyle style={{ backgroundColor: `${slippageTolerance === "0.1" ? "red" : ""}` }} onClick={() => { onSetSlippage("0.1") }} >0.1%</ButtonStyle>
                            <ButtonStyle style={{ backgroundColor: `${slippageTolerance === "0.5" ? "red" : ""}` }} onClick={() => { onSetSlippage("0.5") }} >0.5%</ButtonStyle>
                            <ButtonStyle style={{ backgroundColor: `${slippageTolerance === "1.0" ? "red" : ""}` }} onClick={() => { onSetSlippage("1.0") }} >1.0%</ButtonStyle>
                        </PillowDiv>
                        <PillowDiv>
                            Transaction Speed
                        </PillowDiv>
                    </ConfigModalBody>
                    <ConfigModalBody>
                        <h1>Favorites</h1>
                        <PillowDiv>
                            <WalletSelectionDiv walletSelected={"walletSelected"} onClick={() => { switchWallet("casper") }}>
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
