import React, {useContext, useEffect, useState} from "react";
import {
    OverlayPopup,
    PopupBottom,
    PopupClose,
    PopupContainer,
    PopupContent,
    PopupTitle,
    ButtonHalfMaxContainer,
    ButtonHalfMax,
    InputContainer,
    LPContainer,
    BalanceStyled,
    InputAmountStyled,
    USDLabelStyled,
    LPDetail,
    LPTitleDetail,
    LPLabelDetail,
    InputStyled,
    RemoveButtonContainer
} from "./styles";
import {Button} from "../../atoms"

import {ConfigProviderContext} from "../../../contexts/ConfigContext"

export const PopupsModule = ({isOpen, handleOpen, children}: any) => {

    const {
        configState,
    } = useContext(ConfigProviderContext)

    const {
        walletAddress
    } = configState

    const closeHandler = () => {
        handleOpen(!isOpen)
    }

    return (
        <OverlayPopup isOpen={isOpen}>
            <PopupContainer>
                <PopupTitle>Processing...</PopupTitle>
                <PopupClose onClick={closeHandler}>&times;</PopupClose>
                <PopupContent>
                  {children}
                </PopupContent>
                <PopupBottom>
                    <Button style={{fontSize: "16px", backgroundColor: "transparent", width: "50%", height: "56px"}} handler={closeHandler} content="OK"/>
                </PopupBottom>
            </PopupContainer>
        </OverlayPopup>
    )
}
