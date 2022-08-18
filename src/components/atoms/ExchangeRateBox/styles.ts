import styled from 'styled-components'
import {PriceImpactTitle} from '../PriceImpactTitle'

export const ExchangeRateContainer = styled.section`
    position: relative;
    display: block;
    align-self: center;
    width: 100%;
    padding: 3px;
`
export const ExchangeRateRow = styled.section`
    position: relative;
    display: flex;
    width: 100%;
`
export const ExchangeRateColumnLeft = styled.section`
    padding-right: 10px;
    text-align: left;
`
export const ExchangeRateColumnRight = styled.section`
    text-align: left;
`
export const PriceImpactLabel = styled(PriceImpactTitle)`
    color: ${props => props.priceImpactTitle == 'Low Price Impact'? 'aquamarine':'yellow'}
`