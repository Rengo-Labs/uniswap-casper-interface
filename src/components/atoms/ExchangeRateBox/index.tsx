import React from 'react'
import {AiOutlineSwap} from "react-icons/ai"
import {
    ExchangeRateContainer,
    ExchangeRateColumnLeft,
    ExchangeRateColumnRight,
    ExchangeRateRow
} from './styles'


export const ExchangeRateBox = ({ tokenASymbol, tokenBSymbol, exchangeRateA, exchangeRateB, defaultRate, defaultPriceImpact }:any) => {
    const [tokenB, tokenBSetter] = React.useState<any>(defaultRate)
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
            <ExchangeRateRow>
                <ExchangeRateColumnLeft>
                    1 {symbolA} ~ {tokenB} {symbolB}
                </ExchangeRateColumnLeft>
                <ExchangeRateColumnRight>
                    <AiOutlineSwap onClick={updateTokens}/>
                </ExchangeRateColumnRight>
            </ExchangeRateRow>
            <ExchangeRateRow>
                {defaultPriceImpact}
            </ExchangeRateRow>
        </ExchangeRateContainer>
    )
}
