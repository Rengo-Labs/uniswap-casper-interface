import React, {useContext, useState} from "react";
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
    RemoveButtonContainer,
    PopupButtonStyled
} from "./styles";
import {Button} from "../../atoms"

import {ConfigProviderContext} from "../../../contexts/ConfigContext"
import { calculateMinimumTokenReceived, calculateLPPercentage } from '../../../contexts/PriceImpactContext'

export const LiquidityRemovingModule = ({isConnected, openedPopup, onClose, onRemove, firstToken, secondToken, liquidity, liquidityUSD, setAmount, slippage = 0.003, children}: any) => {

    const [isOpened, setIsOpened] = useState(openedPopup)
    const [value, setValue] = useState("0")
    const [usdValue, setUSDValue] = useState(0.00)

    const {
        firstTokenSelected,
        secondTokenSelected,
        onRemoveLiquidity
    } = useContext(ConfigProviderContext)

    const closeHandler = (e) => {
        onClose()
        setIsOpened(!isOpened)
        setValue("")
    }

    const removeLiquidity = async () => {
        const per = calculateLPPercentage(value, liquidity)
        const t0 = per * parseFloat(firstToken.token0Liquidity)
        const t1 = per * parseFloat(secondToken.token1Liquidity)
        //TODO to check if the lp percentage impact into total liquidity pool or user liquidity pool.
        console.log(firstToken.token0, "=>", t0, "|", secondToken.token1, "=>", t1)
        await onRemoveLiquidity(firstToken.contract0, secondToken.contract1, liquidity, value, t0, t1)
        onRemove()
        setValue("")
    }

    const setHalf = () => {
        const halfValue = liquidity / 2
        setAmount(halfValue)
        setValue((halfValue).toString())
    }

    const setMax = () => {
        setAmount(liquidity)
        setValue((liquidity * 1).toString())
    }

    const setInputValue = (e) => {
        setAmount(parseFloat(e.target.value))
        setValue(e.target.value)
    }

    const enableButton = (value) => {
        return isConnected && value && value > 0 && value <= liquidity
    }

    const calculateUSD = (value) => {
        return (calculateLPPercentage(value, liquidity) * liquidityUSD).toFixed(2)
    }

    return (
        <>
            {
                <PopupButtonStyled data-testid="liq_popup" onClick={closeHandler}>Remove</PopupButtonStyled>
            }
            {
                <OverlayPopup isOpened={isOpened}>
                    <PopupContainer>
                        <PopupTitle>Remove Liquidity</PopupTitle>
                        <PopupClose onClick={closeHandler}>&times;</PopupClose>
                        <PopupContent>
                            <LPContainer>
                                <LPDetail>
                                    <LPTitleDetail>Pool</LPTitleDetail>
                                    <LPLabelDetail>{firstToken.token0}-{secondToken.token1}</LPLabelDetail>
                                </LPDetail>
                                <ButtonHalfMaxContainer>
                                    <ButtonHalfMax data-testid="liq_half" onClick={setHalf}>Half</ButtonHalfMax>
                                    <ButtonHalfMax data-testid="liq_max" onClick={setMax}>Max</ButtonHalfMax>
                                </ButtonHalfMaxContainer>
                                <InputContainer>
                                    <BalanceStyled>Balance: {liquidity}</BalanceStyled>
                                    <InputAmountStyled>
                                        <InputStyled data-testid="liq_input" value={value}
                                                     onChange={setInputValue}
                                                     placeholder={`0.00000000`} />
                                    </InputAmountStyled>
                                    <USDLabelStyled>$ {calculateUSD(value)}</USDLabelStyled>
                                </InputContainer>
                            </LPContainer>
                            <RemoveButtonContainer>
                                <Button data-testid="liq_remove" enabled={enableButton(value)} style={{width: "391px", height: "57px",fontSize: "16px"}} handler={removeLiquidity} content="Remove Liquidity"/>
                            </RemoveButtonContainer>
                        </PopupContent>
                        <PopupBottom>
                            <Button style={{fontSize: "16px", backgroundColor: "transparent", width: "50%", height: "56px"}} handler={closeHandler} content="Cancel"/>
                        </PopupBottom>
                    </PopupContainer>
                </OverlayPopup>
            }
        </>
    )
}
