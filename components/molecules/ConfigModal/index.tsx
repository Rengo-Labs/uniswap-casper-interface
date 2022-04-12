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
import { useWeb3React } from '@web3-react/core';
import { connector } from 'config/web3';
import Torus from "@toruslabs/solana-embed";
import type { TORUS_BUILD_ENV_TYPE } from "@toruslabs/torus-embed";
import { chainIdNetworkMap, web3Obj, whiteLabelData } from './torus';

export const ConfigModal = ({ children }: { children?}) => {

    const { activate, active, deactivate, account, error } = useWeb3React()

    const [openModal, openModalSet] = useAtom(setConfig)
    const [walletSelected, walletSelectedSet] = useAtom(walletAtom)
    //const torus = new Torus();
    const connect = useCallback(() => {
        activate(connector)
        console.log("conectando")
        localStorage.setItem("previouslyConnected", JSON.stringify(true))
    }, [activate])

    const disconnect = () => {
        deactivate()
        console.log("desconectando")
        localStorage.removeItem("previouslyConnected")
    }
    const [publicAddress, setPublicAddress] = useState("");
    const [chainId, setChainId] = useState(4);
    const [buildEnv, setBuildEnv] = useState<TORUS_BUILD_ENV_TYPE>("testing");

    const login = async (): Promise<void> => {
        try {
            const { torus, web3 } = web3Obj;
            await torus.init({
                buildEnv,
                enabledVerifiers: {
                    reddit: false,
                },
                enableLogging: true,
                network: {
                    host: chainIdNetworkMap[chainId.toString()], // mandatory
                    chainId,
                    // chainId: 336,
                    // networkName: 'DES Network',
                    // host: 'https://quorum.block360.io/https',
                    // ticker: 'DES',
                    // tickerName: 'DES Coin',
                },
                showTorusButton: true,
                integrity: {
                    version: '1.11.0',
                    check: false,
                    // hash: 'sha384-jwXOV6VJu+PM89ksbCSZyQRjf5FdX8n39nWfE/iQBMh4r5m027ua2tkQ+83FPdp9'
                },
                loginConfig: buildEnv === 'lrc' ? {
                    'torus-auth0-email-passwordless': {
                        name: 'torus-auth0-email-passwordless',
                        typeOfLogin: 'passwordless',
                        showOnModal: false,
                    },
                } : undefined,
                whiteLabel: whiteLabelData,
                skipTKey: true,
            });
            await torus.login(); // await torus.ethereum.enable()
            sessionStorage.setItem('pageUsingTorus', buildEnv);
            web3Obj.setweb3(torus.provider);
            torus.provider.on('chainChanged', (resp) => {
                console.log(resp, 'chainchanged');
                setChainId(parseInt(resp.toString(), 10))
            });
            torus.provider.on('accountsChanged', (accounts) => {
                console.log(accounts, 'accountsChanged');
                setPublicAddress((Array.isArray(accounts) && accounts[0]) || '');
            });
            const accounts = await web3.eth.getAccounts();
            setPublicAddress((Array.isArray(accounts) && accounts[0]) || '');

            web3.eth.getBalance(accounts[0]).then(console.log).catch(console.error);
        } catch (error) {
            console.error(error, 'caught in vue-app');
        }
    }
    useEffect(() => {
        const initialize = async () => {
            const torus = (await import("@toruslabs/torus-embed")).default;
            web3Obj.torus = new torus({});
            const torusEnv = sessionStorage.getItem('pageUsingTorus');
            if (torusEnv) {
                login();
            }
        }
        initialize();
        if (localStorage.getItem("previouslyConnected") === "true") {
            connect()
        }
    }, [connect])

    const toggleTorusWidget = (): void => {
        const { torus } = web3Obj;
        if (torus.torusWidgetVisibility) {
            torus.hideTorusButton();
        } else {
            torus.showTorusButton();
        }
    }

    return (
        <ModalStyled openModal={openModal}>
            <ContainerStyled>
                <ContentStyled>
                    <ConfigModalHeader>
                        <AiOutlineUser />
                        <button onClick={login}>Login</button>
                        <ButtonConnection isConnected={active} onConnect={connect} onDisconnect={disconnect} Account={account} />
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

