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

export interface LiquidityRemovingModuleProps {
    isConnected: boolean,
    openedPopup: boolean,
    firstSymbol: string,
    firstLiquidity: string,
    firstHash: string,
    secondSymbol: string,
    secondLiquidity: string,
    secondHash: string,
    liquidityId: string,
    liquidity: string,
    allowance: string,
    liquidityUSD: string,
    children?: React.ReactNode,
}

export const LiquidityRemovingModule = ({
    isConnected, 
    openedPopup, 
    firstSymbol, 
    firstLiquidity, 
    firstHash, 
    secondSymbol, 
    secondLiquidity, 
    secondHash, 
    liquidityId, 
    liquidity,
    allowance,
    liquidityUSD, 
    children,
}: LiquidityRemovingModuleProps) => {

    const [isOpened, setIsOpened] = useState(openedPopup)
    const [value, setValue] = useState("0")
    const [contractHash, setContractHash] = useState("")
    console.log(liquidityId)
    const {
        onRemoveLiquidity,
        onIncreaseAllow,
        getContractHashAgainstPackageHash,
        slippageToleranceSelected,
    } = useContext(ConfigProviderContext)

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
        console.log('zz', firstHash, secondHash, firstLiquidity, secondLiquidity)

        await onRemoveLiquidity(value, 
            {
                symbol: firstSymbol.replace('WCSPR', 'CSPR'),
                packageHash: `hash-${firstHash}`,
            } as any, {
                symbol: secondSymbol.replace('WCSPR', 'CSPR'),
                packageHash: `hash-${secondHash}`,
            } as any, 
            firstLiquidity, 
            secondLiquidity, 
            slippageToleranceSelected,
        )
        closeHandler()
    }

    const setHalf = () => {
        const halfValue = parseFloat(liquidity) / 2
        setValue((halfValue).toFixed(8))
    }

    const setMax = () => {
        setValue((parseFloat(liquidity) * 1).toString())
    }

    const setInputValue = (e) => {
        setValue(e.target.value)
    }

    const enableButton = (value) => {
        return isConnected && value && value > 0 && value <= liquidity
    }

    const calculateUSD = (value) => {
        return (calculateLPPercentage(value, liquidity) * parseFloat(liquidityUSD)).toFixed(2)
    }

    const freeAllowanceLiq = parseFloat(allowance) - parseFloat(value)

    return (
        <>
            {
                <div data-testid="liq_popup" onClick={closeHandler}>{children}</div>
            }
            {
                <OverlayPopup isOpened={isOpened}>
                    <div>
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
                                        <USDLabelStyled data-testid="liq_usd">$ {calculateUSD(value)}</USDLabelStyled>
                                    </InputContainer>
                                </LPContainer>
                                    {
                                        freeAllowanceLiq < 0 ?
                                            <RemoveButtonContainer>
                                                {/* TODO: remove inline css*/}
                                                <Button data-testid="liq_enable" style={{width: "391px", height: "57px",fontSize: "16px"}}
                                                        enabled={enableButton(value)} handler={onEnable} content={`Approve ${-freeAllowanceLiq} ${firstSymbol}-${secondSymbol}`}/>
                                            </RemoveButtonContainer> 
                                        :
                                            <RemoveButtonContainer>
                                                {/* TODO: remove inline css*/}
                                                <Button data-testid="liq_remove" style={{width: "391px", height: "57px",fontSize: "16px", marginTop: "10px"}}
                                                        enabled={enableButton(value)} handler={removeLiquidity} content="Remove Liquidity"/>
                                            </RemoveButtonContainer>
                                    }
                            </PopupContent>
                            <PopupBottom>
                                {/* TODO: remove inline css*/}
                                <Button style={{fontSize: "16px", backgroundColor: "transparent", width: "50%", height: "56px"}} handler={closeHandler} content="Cancel"/>
                            </PopupBottom>
                        </PopupContainer>
                    </div>
                </OverlayPopup>
            }
        </>
    )
}
