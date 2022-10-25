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
    RemoveButtonContainer
} from "./styles";
import {Button} from "../../atoms"

import {ConfigProviderContext} from "../../../contexts/ConfigContext"
import { calculateLPPercentage } from '../../../contexts/PriceImpactContext'

export const LiquidityRemovingModule = ({isConnected, openedPopup, onClose, onRemove, firstSymbol, firstLiquidity, firstHash, secondSymbol, secondLiquidity, secondHash, liquidityId, liquidity, liquidityUSD, setAmount, slippage = 0.003, children}: any) => {

    const [isOpened, setIsOpened] = useState(openedPopup)
    const [value, setValue] = useState("0")

    const {
        onRemoveLiquidity,
        onIncreaseAllow
    } = useContext(ConfigProviderContext)

    const closeHandler = (e) => {
        onClose()
        setIsOpened(!isOpened)
        setValue("")
    }

    async function onEnable() {
        await onIncreaseAllow(value, "hash-" + liquidityId)
        onRemove()
    }

    const removeLiquidity = async () => {
        const per = calculateLPPercentage(value, liquidity)
        const t0 = per * parseFloat(firstLiquidity)
        const t1 = per * parseFloat(secondLiquidity)
        //TODO to check if the lp percentage impact into total liquidity pool or user liquidity pool.
        console.log(firstSymbol, "=>", t0, "|", secondSymbol, "=>", t1)
        //await onIncreaseAllow(t1)
        await onRemoveLiquidity(firstHash, secondHash, value, value, t0, t1)
        onRemove()
        setValue("")
    }

    const setHalf = () => {
        const halfValue = liquidity / 2
        setAmount(halfValue.toFixed(8))
        setValue((halfValue).toFixed(8))
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
                <div data-testid="liq_popup" onClick={closeHandler}>{children}</div>
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
                                    <LPLabelDetail>{firstSymbol}-{secondSymbol}</LPLabelDetail>
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
                                <Button data-testid="liq_remove" enabled={enableButton(value)} style={{width: "391px", height: "57px",fontSize: "16px"}} handler={onEnable} content="Enable"/>
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
