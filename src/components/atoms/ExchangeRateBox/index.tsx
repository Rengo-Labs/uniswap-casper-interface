import React from 'react'
import {AiOutlineSwap} from "react-icons/ai"
import {
    ExchangeRateContainer,
    ExchangeRateColumnLeft,
    ExchangeRateColumnRight,
    ExchangeRateRow
} from './styles'

export const ExchangeRateBox = ({ tokenASymbol, tokenBSymbol, exchangeRateA, exchangeRateB, className }:any) => {
    const [switchRate, switchRateSetter] = React.useState(false)

    function updateTokens() {
        switchRateSetter(!switchRate)
    }

    return (
        <ExchangeRateContainer className={className}>
            <ExchangeRateRow data-testid="switch_rate" onClick={updateTokens}>
                {
                    switchRate ?
                        <ExchangeRateColumnLeft data-testid="id_rate">
                            1 {tokenBSymbol} ≈ {(exchangeRateB).toString().slice(0, 10)} {tokenASymbol}
                        </ExchangeRateColumnLeft>
                        : <ExchangeRateColumnLeft data-testid="id_rate">
                            1 {tokenASymbol} ≈ {(exchangeRateA).toString().slice(0, 10)} {tokenBSymbol}
                        </ExchangeRateColumnLeft>
                }
            </ExchangeRateRow>
        </ExchangeRateContainer>
    )
}
