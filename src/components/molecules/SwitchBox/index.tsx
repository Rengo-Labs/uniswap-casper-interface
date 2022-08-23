import React from 'react'
import {
    BoxMovementAnimation,
    ExchangeRateBoxAnimation
} from './styles'
import {SwitchIcon} from "../../atoms";

export const SwitchBox = ({onSwitch, secondTokenSelected, firstTokenSelected, exchangeRateA, exchangeRateB, defaultPriceImpactLabel, active}) => {
    
    return (
        <BoxMovementAnimation active={active}>
            <SwitchIcon onSwitch={onSwitch}
                        secondTokenSelected={secondTokenSelected}
                        firstTokenSelected={firstTokenSelected}
            />
            <ExchangeRateBoxAnimation active={active}
                                      tokenASymbol={firstTokenSelected.symbol}
                                      tokenBSymbol={secondTokenSelected.symbol}
                                      exchangeRateA={exchangeRateA}
                                      exchangeRateB={exchangeRateB}
                                      defaultPriceImpact={defaultPriceImpactLabel}
            />
        </BoxMovementAnimation>
    );
}
