import React from "react";
import {
  HRefLink,
  OverlayPopup,
  PopupBottom,
  PopupClose,
  PopupContainer,
  PopupContent,
  PopupTitle,
  WalletContainer,
  DisclaimerContent,
  PopoverButtonStyled,
  WalletSelectionImageStyled,
  ButtonText
} from "./styles";
import { WalletSelectionDiv } from "../WalletSelectionDiv";
import casperWallet from "../../../assets/walletIcons/casper.png";
import torusWallet from "../../../assets/walletIcons/torus-icon-blue-3.svg";
import casperWallet from "../../../assets/walletIcons/casper.svg";
import torusWallet from "../../../assets/walletIcons/torus.svg";
import { WalletName } from "../../../commons";
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

export const ConnectionPopup = ({
  isConnected,
  title,
  onClose,
  onConnect,
  isOpened,
  onToggle,
  showButton,
}: ConnectionPopup) => {

  const closeHandler = (e) => {
    onClose()
  };

  return (
    <>
      {
        !isConnected && <>
          {
            showButton !== false && <PopoverButtonStyled onClick={onToggle}>Connect Wallet</PopoverButtonStyled>
          }
          <OverlayPopup isOpened={isOpened}>
            <PopupContainer>
              {/* TODO: remove inline css*/}
              <PopupTitle><div style={{ flex: "1" }}>{title}</div><PopupClose onClick={closeHandler}>&times;</PopupClose></PopupTitle>
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
