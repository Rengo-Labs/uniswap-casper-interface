import styled from 'styled-components'
import {PriceImpactTitle} from '../PriceImpactTitle'

export const ExchangeRateContainer = styled.section`
    position: relative;
    display: block;
    align-self: center;
    width: 100%;
    padding: 3px;
`

export const SlippageContainer = styled.section`
    position: relative;
    display: flex;
    width: 100%;
    padding: 3px;
`
export const SlippageColumnLeft = styled.section`
    width: 50%;
    text-align: start;
`
export const SlippageColumnRight = styled.section`
    width: 50%;
    text-align: end;
`
export const Input = styled.input`
    background: transparent;
    color: white;
    width: 25%;
`
export const Span = styled.span`
    position: absolute;
    right: 10px;
    top: 10px;
`