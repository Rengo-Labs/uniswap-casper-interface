import React, {useState} from 'react'
import styled from 'styled-components'
import {
    SwitchContainerStyled,
    SwitchIconAnimation,
    ExchangeRateBoxAnimation
} from './styles'
import {SwitchIcon, ExchangeRateBox} from '../../atoms'

export const SwitchBox = ({onSwitch, secondTokenSelected, firstTokenSelected, exchangeRateA, exchangeRateB, defaultRate, defaultPriceImpactLabel, active}) => {
    
    return (
        <SwitchContainerStyled>
            <SwitchIconAnimation active={active} onSwitch={onSwitch} secondTokenSelected={secondTokenSelected} firstTokenSelected={firstTokenSelected}/>
            <ExchangeRateBoxAnimation active={active} 
                                      tokenASymbol={firstTokenSelected.symbol} 
                                      tokenBSymbol={secondTokenSelected.symbol} 
                                      exchangeRateA={exchangeRateA} 
                                      exchangeRateB={exchangeRateB} 
                                      defaultRate={defaultRate} 
                                      defaultPriceImpact={defaultPriceImpactLabel}
            />
        </SwitchContainerStyled>
    );
}
