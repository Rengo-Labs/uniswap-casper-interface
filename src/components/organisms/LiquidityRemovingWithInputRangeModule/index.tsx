import React, { useContext, useEffect, useState } from "react";
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
  PriceTokenLabel,
  TokenSymbol,
  TokenName,
  SymbolContainer,
  TColumn1Right,
  PriceRowLabel,
  SwapIconImageStyled,
  SwapIconImageStyledRelative
} from "./styles";
import { LiquidityCancelButton, LiquidityEnableButton, LiquidityRemoveButton } from "../../atoms"

import { ConfigProviderContext } from "../../../contexts/ConfigContext"
import { InputRange } from "../../atoms/InputRange"
import { LiquidityProviderContext } from "../../../contexts/LiquidityContext"
import BigNumber from "bignumber.js";

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
  contractHash: string,
  packageHash: string,
  liquidity: string,
  allowance: string,
  firstIcon: any,
  secondIcon: any,
  decimals: number,
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
  contractHash,
  packageHash,
  liquidity,
  allowance,
  firstIcon,
  secondIcon,
  decimals,
  children,
}: LiquidityRemovingWithInputRangeProps) => {

  const [isOpened, setIsOpened] = useState(openedPopup)
  const [value, setValue] = useState(0)
  const [lpValue, setLPValue] = useState(0.00)
  const [firstValue, setFirstValue] = useState(0.00)
  const [secondValue, setSecondValue] = useState(0.00)

  const {
    onIncreaseAllow,
    slippageToleranceSelected,
    gasPriceSelectedForLiquidity,
  } = useContext(ConfigProviderContext)

  const { onRemoveLiquidity } = useContext(LiquidityProviderContext)

  const closeHandler = () => {
    setValue(0)
    setIsOpened(!isOpened)
  }

  async function onEnable() {
    await onIncreaseAllow(lpValue, contractHash)
  }

  const removeLiquidity = async () => {
    await onRemoveLiquidity(lpValue,
      {
        symbol: firstSymbol.replace('WCSPR', 'CSPR'),
        packageHash: firstHash,
      } as any, {
        symbol: secondSymbol.replace('WCSPR', 'CSPR'),
        packageHash: secondHash,
      } as any,
      firstValue,
      secondValue,
      slippageToleranceSelected,
      gasPriceSelectedForLiquidity,
    )
    closeHandler()
  }

  const setInputValue = (inputValue: number) => {
    const inputPercent = new BigNumber(inputValue / 100)
    setValue(inputValue)
    setLPValue(
      parseFloat(inputPercent
        .times(liquidity)
        .toFixed(decimals)
      )
    )
    setFirstValue(
      parseFloat(inputPercent
        .times(firstLiquidity)
        .toFixed(decimals)
      )
    )
    setSecondValue(
      parseFloat(inputPercent
        .times(secondLiquidity)
        .toFixed(decimals)
      )
    )
  }

  const enableButton = (value) => {
    return isConnected && value && parseFloat(value) > 0 && value <= parseFloat(liquidity)
  }

  const freeAllowanceLiq = parseFloat(allowance) - lpValue

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
                  <InputRange handler={setInputValue} initialValue={value} />
                </InputAmountStyled>
                <br />
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
                    <TColumn1Right data-testid="liq_pair">
                      {lpValue.toFixed(8) || "0.00"}
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
                      {firstValue.toFixed(8)}
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
                      {secondValue.toFixed(8)}
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
                      <LiquidityEnableButton testid="liq_enable" enabled={enableButton(lpValue.toFixed(decimals))} handler={onEnable} content={`Approve ${-freeAllowanceLiq.toFixed(decimals)} ${firstSymbol}-${secondSymbol}`} />
                    </RemoveButtonContainer>
                    :
                    <RemoveButtonContainer>
                      <LiquidityRemoveButton testid="liq_remove" enabled={enableButton(lpValue.toFixed(decimals))} handler={removeLiquidity} content="Remove Liquidity" />
                    </RemoveButtonContainer>
                }
              </PopupContent>
              <PopupBottom>
                <LiquidityCancelButton handler={closeHandler} content="Cancel" />
              </PopupBottom>
            </PopupContainer>
          </div>
        </OverlayPopup>
      }
    </>
  )
}
