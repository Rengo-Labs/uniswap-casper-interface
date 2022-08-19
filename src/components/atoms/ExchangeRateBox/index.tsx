import React from 'react'
import {AiOutlineSwap} from "react-icons/ai"
import {
    ExchangeRateContainer,
    ExchangeRateColumnLeft,
    ExchangeRateColumnRight,
    ExchangeRateRow,
    PriceImpactLabel
} from './styles'

export const ExchangeRateBox = ({ tokenASymbol, tokenBSymbol, exchangeRateA, exchangeRateB, defaultPriceImpact, className }:any) => {
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
                        1 {tokenASymbol} ~ {(exchangeRateB / exchangeRateA).toString().slice(0, 10)} {tokenBSymbol}
                    </ExchangeRateColumnLeft>
                }
                {
                    !switchRate &&
                    <ExchangeRateColumnLeft>
                        1 {tokenBSymbol} ~ {(exchangeRateA / exchangeRateB).toString().slice(0, 10)} {tokenASymbol}
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
