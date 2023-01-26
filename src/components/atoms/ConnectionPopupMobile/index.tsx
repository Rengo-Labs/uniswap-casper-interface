import React from "react";
import {NewIcons} from "../NewIcons";
import { ReactComponent as walletConnected } from "../../../assets/newIcons/mobile-account-connect.svg";
import {
    ButtonText,
    DisclaimerContent, HRefLink,
    OverlayPopup,
    PopoverButtonStyled, PopupBottom,
    PopupClose,
    PopupContainer,
    PopupContent,
    PopupTitle, WalletContainer, WalletSelectionImageStyled
} from "../ConnectionPopup/styles";
import {WalletSelectionDiv} from "../WalletSelectionDiv";
import {WalletName} from "../../../commons";
import casperWallet from "../../../assets/walletIcons/casper.svg";
import torusWallet from "../../../assets/walletIcons/torus.svg";
import {ButtonStyleMobile} from "./styles";
import {CasperIcons} from "../CasperIcon";
import { useTheme } from "styled-components";
import { LightThemeInterface } from "../../../contexts/ThemeContext/themes";

export interface ConnectionPopup {
    isConnected: boolean,
    isOpened: boolean,
    title: string,
    onClose: () => void,
    onConnect: (name: WalletName) => void,
    onToggle: () => void,
    showButton?: boolean
}
export const ConnectionPopupMobile = ({  isConnected,
                                          title,
                                          onClose,
                                          onConnect,
                                          isOpened,
                                          onToggle,
                                          showButton} : ConnectionPopup) => {
    const theme = useTheme() as LightThemeInterface;
    const closeHandler = (e) => {
        onClose()
    };

    return (
        <>
            {
                !isConnected && <>
                    {
                        showButton !== false && <ButtonStyleMobile isSelected={isConnected} onClick={onToggle}><CasperIcons Icon={walletConnected} height={36} width={36} /></ButtonStyleMobile>
                    }
                    <OverlayPopup isOpened={isOpened}>
                        <PopupContainer>
                            {/* TODO: remove inline css*/}
                            <PopupTitle><div style={{ flex: "3 1 0%" }}>{title}</div><PopupClose onClick={closeHandler}>&times;</PopupClose></PopupTitle>
                            <PopupContent>
                                <DisclaimerContent>
                                    By connecting your wallet, you acknowledge that you have read, understand and accept the terms in the Disclaimer
                                </DisclaimerContent>
                                <WalletContainer>
                                    {/* TODO: remove inline css*/}
                                    <WalletSelectionDiv style={{ backgroundColor: "lightgray" }} isSelected={false} onClick={() => onConnect(WalletName.CASPER_SIGNER)}>
                                        <WalletSelectionImageStyled src={casperWallet} alt="" />
                                        <ButtonText>Signer Wallet</ButtonText>
                                    </WalletSelectionDiv>
                                    {/* TODO: remove inline css*/}
                                    <WalletSelectionDiv style={{ backgroundColor: "lightgray" }} isSelected={false} onClick={() => onConnect(WalletName.TORUS)}>
                                        <WalletSelectionImageStyled src={torusWallet} alt="" />
                                        <ButtonText>Torus Wallet</ButtonText>
                                    </WalletSelectionDiv>
                                </WalletContainer>
                                {
                                    //<CollapsingPopup>show uninstall wallets <HiChevronDown /></CollapsingPopup>
                                }
                            </PopupContent>
                            <PopupBottom><HRefLink>New Here? Get started on Casperswap</HRefLink></PopupBottom>
                        </PopupContainer>
                    </OverlayPopup>
                </>
            }
        </>
    )
}
