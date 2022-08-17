import React, {useState} from 'react'
import styled from 'styled-components'
import {
    SwitchContainerStyled
} from './styles'
import {SwitchIcon, ExchangeRateBox} from '../../atoms'

const WrapThing = props => {
    return <SwitchIcon  switchHandler={props.onSwitch} secondTokenSelected={props.secondTokenSelected} firstTokenSelected={props.firstTokenSelected}/>
}

const StyledThing = styled(WrapThing)`
  transition: all 2s;
  margin-left: ${props => (props.active ? "10%" : "40%")};
`;

export const SwitchBox = ({onSwitch, secondTokenSelected, firstTokenSelected, exchangeRateA, exchangeRateB, defaultRate, defaultPriceImpactLabel, active}) => {

    return (
        <SwitchContainerStyled>
            <WrapThing active={active} onSwitch={onSwitch} secondTokenSelected={secondTokenSelected} firstTokenSelected={firstTokenSelected}/>
            <ExchangeRateBox tokenASymbol={firstTokenSelected.symbol}
                             tokenBSymbol={secondTokenSelected.symbol}
                             exchangeRateA={exchangeRateA}
                             exchangeRateB={exchangeRateB}
                             defaultRate={defaultRate}
                             defaultPriceImpact={defaultPriceImpactLabel}
            />
        </SwitchContainerStyled>
    );
}
