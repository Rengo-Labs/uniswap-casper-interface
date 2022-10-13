import React, {useState} from "react";
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
    PopoverButtonStyled,
    ButtonHalfMaxContainer,
    ButtonHalfMax
} from "./styles";
import {Button} from "../../atoms";

export const LiquidityRemovingModule = ({isConnected, title, onClose, tokenLP, setAmount}) => {

    const [isOpened, setIsOpened] = useState(false)

    const closeHandler = (e) => {
        onClose()
    };

    const makeHalf = (amount) => {
        setAmount(amount / 2)
    }

    const makeMax = (amount) => {
        setAmount(amount / 2)
    }

    return (
        <>
            {
                !isConnected &&
                <PopoverButtonStyled onClick={() => {setIsOpened(!isOpened)}}>Remove</PopoverButtonStyled>
            }
            {
                !isConnected &&
                <OverlayPopup isOpened={isOpened}>
                    <PopupContainer>
                        <PopupTitle>{title}</PopupTitle>
                        <PopupClose onClick={closeHandler}>&times;</PopupClose>
                        <PopupContent>
                            <div style={{display: "flex", border: "1px solid black", borderRadius: "10px", backgroundColor: "white", width: "392.55px",
                                marginLeft: "23px", marginRight: "23px"}}>
                                <div style={{flex: "1"}}>
                                    <div style={{fontSize: "2vh"}}>pool</div>
                                    <div style={{fontSize: "2.5vh"}}>CASP-ETH</div>
                                </div>
                                <div style={{flex: "0.7"}}>
                                    <ButtonHalfMaxContainer>
                                        <ButtonHalfMax onClick={() => { makeHalf(tokenLP.amount) }}>Half</ButtonHalfMax>
                                        <ButtonHalfMax onClick={() => { makeMax(tokenLP.amount) }}>Max</ButtonHalfMax>
                                    </ButtonHalfMaxContainer>
                                </div>
                                <div style={{flex: "1"}}>
                                    <div>Balance right</div>
                                    <div>Quantity</div>
                                </div>
                            </div>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <Button handler={closeHandler} content="Remove Liquidity"/>
                            </div>
                        </PopupContent>
                        <PopupBottom style={{display: "flex", justifyContent: "center"}}><Button handler={closeHandler} content="Cancel"/></PopupBottom>
                    </PopupContainer>
                </OverlayPopup>
            }
        </>
    )
}
