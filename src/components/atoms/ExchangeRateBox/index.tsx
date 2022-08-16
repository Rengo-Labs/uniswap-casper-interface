import React from 'react'
import {AiOutlineSwap} from "react-icons/ai"
import {ExchangeRateContainer, ExchangeRateColumnLeft, ExchangeRateColumnMiddle, ExchangeRateColumnRight} from './styles'


export const ExchangeRateBox = ({ tokenASymbol, tokenBSymbol, exchangeRateA, exchangeRateB, defaultValue }:any) => {
    const [tokenB, tokenBSetter] = React.useState<any>(defaultValue)
    const [symbolA, symbolASetter] = React.useState<any>(tokenASymbol)
    const [symbolB, symbolBSetter] = React.useState<any>(tokenBSymbol)
    const [switchRate, switchRateSetter] = React.useState(true)

    function updateTokens() {
        
        if (switchRate) {
            symbolASetter(tokenASymbol)
            symbolBSetter(tokenBSymbol)
            tokenBSetter((exchangeRateB / exchangeRateA).toString().slice(0, 10))
            switchRateSetter(false)
        } else {
            symbolASetter(tokenBSymbol)
            symbolBSetter(tokenASymbol)
            tokenBSetter((exchangeRateA / exchangeRateB).toString().slice(0, 10))
            switchRateSetter(true)
        }
        
        console.log("Change data ")
    }

    return (
        <ExchangeRateContainer>
            <ExchangeRateColumnLeft>
                1 {symbolA}
            </ExchangeRateColumnLeft>
            <ExchangeRateColumnMiddle>
                <AiOutlineSwap onClick={updateTokens}/>
            </ExchangeRateColumnMiddle>
            <ExchangeRateColumnRight>
                {tokenB} {symbolB}
            </ExchangeRateColumnRight>
        </ExchangeRateContainer>
    )
}
