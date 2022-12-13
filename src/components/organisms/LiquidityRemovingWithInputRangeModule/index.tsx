import React, {useContext, useEffect, useState} from "react";
import {
    OverlayPopup,
    PopupBottom,
    PopupClose,
    PopupContainer,
    PopupContent,
    PopupTitle,
    LPContainer,
    SymbolSubTitle,
    InputAmountStyled,
    RemoveButtonContainer,
    TColumn1,
    TColumn3,
    PriceContainer,
    PriceLabel,
    PriceTokenLabel, TokenSymbol, TokenName, SymbolContainer, TColumn1Right, PriceRowLabel
} from "./styles";
import {LiquidityCancelButton, LiquidityEnableButton, LiquidityRemoveButton} from "../../atoms"

import {ConfigProviderContext} from "../../../contexts/ConfigContext"
import { calculateLPPercentage } from '../../../contexts/PriceImpactContext'
import {InputRange} from "../../atoms/InputRange";
import {SwapIconImageStyled, SwapIconImageStyledRelative} from "../../molecules/SwapToken/styles";
import { v4 as uuidv4 } from 'uuid';

export interface LiquidityRemovingWithInputRangeProps {
    isConnected: boolean,
    openedPopup: boolean,
    firstName: string,
    firstSymbol: string,
    firstLiquidity: string,
    firstHash: string,
    firstPrice: string,
    secondName: string,
    secondSymbol: string,
    secondLiquidity: string,
    secondHash: string,
    secondPrice: string,
    liquidityId: string,
    liquidity: string,
    allowance: string,
    liquidityUSD: string,
    firstIcon: any,
    secondIcon: any,
    children?: React.ReactNode,
}

export const LiquidityRemovingWithInputRangeModule = ({
    isConnected,
    openedPopup,
    firstName,
    firstSymbol,
    firstLiquidity,
    firstHash,
    firstPrice,
    secondName,
    secondSymbol,
    secondLiquidity,
    secondHash,
    secondPrice,
    liquidityId,
    liquidity,
    allowance,
    liquidityUSD,
    firstIcon,
    secondIcon,
    children,
}: LiquidityRemovingWithInputRangeProps) => {

    const [isOpened, setIsOpened] = useState(openedPopup)
    const [value, setValue] = useState(0)
    const [lpValue, setLPValue] = useState("0.00")
    const [contractHash, setContractHash] = useState("")
    const [firstValue, setFirstValue] = useState("0.00")
    const [secondValue, setSecondValue] = useState("0.00")

    const {
        onRemoveLiquidity,
        onIncreaseAllow,
        getContractHashAgainstPackageHash,
        slippageToleranceSelected,
    } = useContext(ConfigProviderContext)

    const closeHandler = () => {
        setIsOpened(!isOpened)
        setValue(0)
    }

    useEffect(() => {
        const promise = async () => {
            const result = await getContractHashAgainstPackageHash(liquidityId)
            setContractHash(result)
        }
        promise().catch(e => console.log("Error retrieving contract hash"))
    }, [])

    async function onEnable() {
        await onIncreaseAllow(lpValue, "hash-" + contractHash)
    }

    const removeLiquidity = async () => {
        console.log('zz', firstHash, secondHash, firstLiquidity, secondLiquidity)

        await onRemoveLiquidity(lpValue,
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

    const setInputValue = (inputValue) => {
        setValue(inputValue)
        setLPValue((inputValue * parseFloat(liquidity)).toFixed(8))
        setFirstValue((inputValue * parseFloat(firstLiquidity)).toFixed(8))
        setSecondValue((inputValue * parseFloat(secondLiquidity)).toFixed(8))
    }

    const enableButton = (value) => {
        return isConnected && value && value > 0 && value <= liquidity
    }

    const calculateUSD = (value) => {
        return (calculateLPPercentage(value, liquidity) * parseFloat(liquidityUSD)).toFixed(2)
    }

    const freeAllowanceLiq = parseFloat(allowance) - parseFloat(lpValue)

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
                                <InputAmountStyled>
                                    <InputRange handler={setInputValue} initialValue={value}/>
                                </InputAmountStyled>
                                <br/>
                                <LPContainer>
                                    <TColumn1>
                                        <TColumn1>
                                            <SwapIconImageStyled src={firstIcon} width="30" height="30" />
                                            <SwapIconImageStyledRelative src={secondIcon} width="30" height="30" />
                                        </TColumn1>
                                        <TColumn3>
                                            <SymbolContainer>
                                                <TokenSymbol>
                                                    {firstName}
                                                </TokenSymbol>
                                                <TokenName>
                                                    {firstSymbol}
                                                </TokenName>
                                            </SymbolContainer>
                                            <SymbolContainer>
                                                <TokenSymbol>
                                                    {secondName}
                                                </TokenSymbol>
                                                <TokenName>
                                                    {secondSymbol}
                                                </TokenName>
                                            </SymbolContainer>
                                        </TColumn3>
                                        <TColumn1Right>
                                            {lpValue || "0.00"}
                                        </TColumn1Right>
                                    </TColumn1>
                                </LPContainer>
                                <LPContainer>
                                    <TColumn1>
                                        <TColumn1>
                                            <SwapIconImageStyled src={firstIcon} width="30" height="30" />
                                        </TColumn1>
                                        <TColumn3>
                                            <SymbolContainer>{firstName}</SymbolContainer>
                                            <SymbolSubTitle>{firstSymbol}</SymbolSubTitle>
                                        </TColumn3>
                                        <TColumn1Right>
                                            {firstValue}
                                        </TColumn1Right>
                                    </TColumn1>
                                </LPContainer>
                                <LPContainer>
                                    <TColumn1>
                                        <TColumn1>
                                            <SwapIconImageStyled src={secondIcon} width="30" height="30" />
                                        </TColumn1>
                                        <TColumn3>
                                            <SymbolContainer>{secondName}</SymbolContainer>
                                            <SymbolSubTitle>{secondSymbol}</SymbolSubTitle>
                                        </TColumn3>
                                        <TColumn1Right>
                                            {secondValue}
                                        </TColumn1Right>
                                    </TColumn1>
                                </LPContainer>
                                <PriceContainer>
                                    <PriceLabel>Price</PriceLabel>
                                    <PriceTokenLabel>
                                        <PriceRowLabel>1 {firstSymbol} = {secondPrice.slice(0, 11)} {secondSymbol}</PriceRowLabel>
                                        <PriceRowLabel>1 {secondSymbol} = {firstPrice.slice(0, 11)} {firstSymbol}</PriceRowLabel>
                                    </PriceTokenLabel>
                                </PriceContainer>
                                    {
                                        freeAllowanceLiq < 0 ?
                                            <RemoveButtonContainer>

                                                <LiquidityEnableButton data-testid="liq_enable" enabled={enableButton(lpValue)} handler={onEnable} content={`Approve ${-freeAllowanceLiq} ${firstSymbol}-${secondSymbol}`}/>
                                            </RemoveButtonContainer>
                                        :
                                            <RemoveButtonContainer>
                                                <LiquidityRemoveButton data-testid="liq_remove" enabled={enableButton(lpValue)} handler={removeLiquidity} content="Remove Liquidity"/>
                                            </RemoveButtonContainer>
                                    }
                            </PopupContent>
                            <PopupBottom>

                                <LiquidityCancelButton handler={closeHandler} content="Cancel"/>
                            </PopupBottom>
                        </PopupContainer>
                    </div>
                </OverlayPopup>
            }
        </>
    )
}
