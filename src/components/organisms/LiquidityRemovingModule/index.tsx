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
import { calculateLPPercentage } from '../../../contexts/PriceImpactContext'

export const LiquidityRemovingModule = ({isConnected, openedPopup, firstSymbol, firstLiquidity, firstHash, secondSymbol, secondLiquidity, secondHash, liquidityId, liquidity, liquidityUSD, slippage = 0.003, children}: any) => {

    const [isOpened, setIsOpened] = useState(openedPopup)
    const [value, setValue] = useState("0")
    const [contractHash, setContractHash] = useState("")
    const [allowanceLiq, setAllowanceLiq] = useState(0)

    const {
        configState,
        onRemoveLiquidity,
        onIncreaseAllow,
        getAllowanceAgainstOwnerAndSpender,
        getContractHashAgainstPackageHash
    } = useContext(ConfigProviderContext)

    const {
        walletAddress
    } = configState

    const closeHandler = () => {
        setIsOpened(!isOpened)
        setValue("")
    }

    useEffect(() => {
        const promise = async () => {
            const result = await getContractHashAgainstPackageHash(liquidityId)
            setContractHash(result)
        }
        promise().catch(e => console.log("Error retrieving contract hash"))
    }, [])



    async function onEnable() {
        await onIncreaseAllow(value, "hash-" + contractHash)
    }

    const removeLiquidity = async () => {
        const per = calculateLPPercentage(value, liquidity)
        const t0 = per * parseFloat(firstLiquidity)
        const t1 = per * parseFloat(secondLiquidity)

        await getAllowanceAgainstOwnerAndSpender(contractHash, walletAddress)
        await onRemoveLiquidity(firstHash, secondHash, value, value, t0, t1)
        closeHandler()
    }

    const setHalf = () => {
        const halfValue = liquidity / 2
        setValue((halfValue).toFixed(8))
    }

    const setMax = () => {
        setValue((liquidity * 1).toString())
    }

    const setInputValue = (e) => {
        setValue(e.target.value)
    }

    const enableButton = (value) => {
        return isConnected && value && value > 0 && value <= liquidity
    }

    const calculateUSD = (value) => {
        return (calculateLPPercentage(value, liquidity) * liquidityUSD).toFixed(2)
    }

    const freeAllowanceLiq = allowanceLiq / Math.pow(10, 9) - parseFloat(value)

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
                                <Button data-testid="liq_remove" style={{width: "391px", height: "57px",fontSize: "16px"}}
                                        enabled={enableButton(value)} handler={onEnable} content={`Approve ${-freeAllowanceLiq} ${firstSymbol}-${secondSymbol}`}/>
                            </RemoveButtonContainer>
                            <RemoveButtonContainer>
                                <Button data-testid="liq_remove" style={{width: "391px", height: "57px",fontSize: "16px", marginTop: "10px"}}
                                        enabled={enableButton(value)} handler={removeLiquidity} content="Remove Liquidity"/>
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
