import React, { useEffect, useState } from "react";
import {
    CollapsingPopup,
    HRefLink,
    OverlayPopup,
    PopupBottom,
    PopupClose,
    PopupContainer,
    PopupContent,
    PopupTitle,
    WalletContainer,
    DisclaimerContent,
    PopoverButtonStyled
} from "./styles";
import {WalletSelectionDiv} from "../WalletSelectionDiv";
import {WalletSelectionImageStyled} from "../../molecules/ConfigModal/styles";
import casperWallet from "../../../assets/walletIcons/casper.png";
import torusWallet from "../../../assets/walletIcons/torus-icon-blue-3.svg";
import { HiChevronDown } from "react-icons/hi";

export const ConnectionPopup = ({isConnected, title, onClose, onConnect, isOpened, toggling}) => {

    const closeHandler = (e) => {
        onClose()
    };

    return (
        <>
            {
                !isConnected &&
                <PopoverButtonStyled onClick={toggling}>Connect Wallet</PopoverButtonStyled>
            }
            {
                !isConnected &&
                <OverlayPopup isOpened={isOpened}>
                    <PopupContainer>
                        <PopupTitle><div style={{flex: "1"}}>{title}</div><PopupClose onClick={closeHandler}>&times;</PopupClose></PopupTitle>
                        <PopupContent>
                            <DisclaimerContent>
                                By connecting your wallet, you acknowledge that you have read, understand and accept the terms in the Disclaimer
                            </DisclaimerContent>
                            <WalletContainer>
                                <WalletSelectionDiv style={{ backgroundColor: "lightgray" }} walletSelected={"walletSelected"} onClick={onConnect}>
                                    <WalletSelectionImageStyled src={casperWallet} alt="" />
                                    <h2>Signer Wallet</h2>
                                </WalletSelectionDiv>
                                <WalletSelectionDiv style={{ backgroundColor: "lightgray" }} walletSelected={"walletSelected"} onClick={onConnect}>
                                    <WalletSelectionImageStyled src={torusWallet} alt="" />
                                    <h2>Torus Wallet</h2>
                                </WalletSelectionDiv>
                            </WalletContainer>
                            <CollapsingPopup>show uninstall wallets <HiChevronDown /></CollapsingPopup>
                        </PopupContent>
                        <PopupBottom><HRefLink>New Here? Get started on Casperswap</HRefLink></PopupBottom>
                    </PopupContainer>
                </OverlayPopup>
            }
        </>
    )
}
