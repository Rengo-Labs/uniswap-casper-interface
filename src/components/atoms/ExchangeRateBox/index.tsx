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
                              {(exchangeRateB).toString().slice(0, 10)} {tokenASymbol} ≈ 1 {tokenBSymbol}
                        </ExchangeRateColumnLeft>
                        : <ExchangeRateColumnLeft data-testid="id_rate">
                              {(exchangeRateA).toString().slice(0, 10)} {tokenBSymbol} ≈ 1 {tokenASymbol}
                        </ExchangeRateColumnLeft>
                }
            </ExchangeRateRow>
        </ExchangeRateContainer>
    )
}
