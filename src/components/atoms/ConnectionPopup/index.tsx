import React, { useEffect, useState } from "react";
import "./custom-popup.css";
import {
    CollapsingPopup,
    HRefLink,
    OverlayPopup,
    PopupBottom,
    PopupClose,
    PopupContainer,
    PopupContent,
    PopupTitle,
    WalletContainer
} from "./styles";
import {DisclaimerContent} from "../../organisms/ButtonConnectionOver/styles";
import {WalletSelectionDiv} from "../WalletSelectionDiv";
import {WalletSelectionImageStyled} from "../../molecules/ConfigModal/styles";
import casperWallet from "../../../assets/walletIcons/casper.png";
import torusWallet from "../../../assets/walletIcons/torus-icon-blue-3.svg";
import { HiChevronDown } from "react-icons/hi";

const ConnectionPopup = ({title, isShown, onClose, onConnect}) => {
    const [show, setShow] = useState(false);

    const closeHandler = (e) => {
        setShow(false);
        onClose()
    };

    useEffect(() => {
        setShow(isShown);
    }, [isShown]);

    return (
        <OverlayPopup style={{
            visibility: show ? "visible" : "hidden",
            opacity: show ? "1" : "0", zIndex: "2"}}
             className={"overlay"}>
            <PopupContainer>
                <PopupTitle>{title}</PopupTitle>
                <PopupClose onClick={closeHandler}>&times;</PopupClose>
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
                <PopupBottom><HRefLink>New Here?</HRefLink> Get started on Casperswap</PopupBottom>
            </PopupContainer>
        </OverlayPopup>
    )
}

export default ConnectionPopup;