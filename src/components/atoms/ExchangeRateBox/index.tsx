import React from 'react'
import {AiOutlineSwap} from "react-icons/ai"
import {
    ExchangeRateContainer,
    ExchangeRateColumnLeft,
    ExchangeRateColumnRight,
    ExchangeRateRow,
    PriceImpactLabel
} from './styles'

export const ExchangeRateBox = ({ tokenASymbol, tokenBSymbol, exchangeRateA, exchangeRateB, defaultRate, defaultPriceImpact, className }:any) => {
    const [tokenB, tokenBSetter] = React.useState(defaultRate)
    const [symbolA, symbolASetter] = React.useState<any>(tokenASymbol)
    const [symbolB, symbolBSetter] = React.useState<any>(tokenBSymbol)
    const [switchRate, switchRateSetter] = React.useState(false)

    function updateTokens() {
        switchRateSetter(!switchRate)
    }

    return (
        <ExchangeRateContainer className={className}>
            <ExchangeRateRow>
                {
                    switchRate &&
                    <ExchangeRateColumnLeft>
                        1 {symbolA} ~ {(exchangeRateB / exchangeRateA).toString().slice(0, 10)} {symbolB}
                    </ExchangeRateColumnLeft>
                }
                {
                    !switchRate &&
                    <ExchangeRateColumnLeft>
                        1 {symbolB} ~ {(exchangeRateA / exchangeRateB).toString().slice(0, 10)} {symbolA}
                    </ExchangeRateColumnLeft>
                }
                <ExchangeRateColumnRight>
                    <AiOutlineSwap onClick={updateTokens}/>
                </ExchangeRateColumnRight>
            </ExchangeRateRow>
            <PriceImpactLabel priceImpactTitle={defaultPriceImpact} />
        </ExchangeRateContainer>
    )
}
