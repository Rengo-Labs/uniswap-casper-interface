import React from 'react'
import {
  ExchangeRateContainer,
  ExchangeRateColumnLeft,
  ExchangeRateRow
} from './styles'

export interface ExchangeRateBoxProps {
  tokenASymbol: string,
  tokenBSymbol: string,
  exchangeRateA: number,
  exchangeRateB: number,
  className?: string,
}

export const ExchangeRateBox = ({ 
  tokenASymbol, 
  tokenBSymbol, 
  exchangeRateA, 
  exchangeRateB, 
  className,
}: ExchangeRateBoxProps) => {
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
              {exchangeRateB ? (exchangeRateB).toFixed(6): '???'} {tokenASymbol} ≈ 1 {tokenBSymbol}
            </ExchangeRateColumnLeft>
            : <ExchangeRateColumnLeft data-testid="id_rate">
              {exchangeRateA ? (exchangeRateA).toFixed(6): '???'} {tokenBSymbol} ≈ 1 {tokenASymbol}
            </ExchangeRateColumnLeft>
        }
      </ExchangeRateRow>
    </ExchangeRateContainer>
  )
}
