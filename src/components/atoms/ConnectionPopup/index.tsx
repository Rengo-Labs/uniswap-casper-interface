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
  ButtonText, TFlex1
} from "./styles";
import { ReactComponent as Close } from "../../../assets/newIcons/x.svg";
import { WalletSelectionDiv } from "../WalletSelectionDiv";
import casperWallet from "../../../assets/walletIcons/casper.svg";
import torusWallet from "../../../assets/walletIcons/torus.svg";
import { WalletName } from "../../../commons";
import { NewIcons } from "../NewIcons";
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

  const theme = useTheme() as LightThemeInterface;
  const closeHandler = (e) => {
    onClose()
  };

  return (

    <>
      {!isConnected && (
        <>
          {showButton !== false && <PopoverButtonStyled onClick={onToggle}>Connect Wallet</PopoverButtonStyled>}
          <OverlayPopup isOpened={isOpened}>
            <PopupContainer>
              <PopupTitle>
                {title}
                <PopupClose onClick={closeHandler}>
                  <NewIcons Icon={Close} size={24} style={{ fill: theme.NewPurpleColor }} />
                </PopupClose>
              </PopupTitle>
              <PopupContent>
                <DisclaimerContent>
                  By connecting your wallet, you acknowledge that you have read, understand and accept
                  the terms in the Disclaimer
                </DisclaimerContent>
                <WalletContainer>
                  <WalletSelectionDiv
                    isSelected={false}
                    onClick={() => onConnect(WalletName.CASPER_SIGNER)}
                  >
                    <WalletSelectionImageStyled src={casperWallet} alt="" />
                    <ButtonText>Signer Wallet</ButtonText>
                  </WalletSelectionDiv>
                  <WalletSelectionDiv
                    isSelected={false}
                    onClick={() => onConnect(WalletName.TORUS)}
                  >
                    <WalletSelectionImageStyled src={torusWallet} alt="" />
                    <ButtonText>Torus Wallet</ButtonText>
                  </WalletSelectionDiv>
                </WalletContainer>
                {
                  //<CollapsingPopup>show uninstall wallets <HiChevronDown /></CollapsingPopup>
                }
              </PopupContent>
              <PopupBottom>
                <a href='https://docs.casperswap.xyz/the-casperswap-protocol-1/how-to-make-a-swap-on-casperswap'>
                  <HRefLink>New Here? Get started on Casperswap</HRefLink>
                </a>
              </PopupBottom>
            </PopupContainer>
          </OverlayPopup>
        </>
      )}
    </>
  );

}
