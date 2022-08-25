import React from 'react'
import {
    SlippageContainer,
    SlippageColumnLeft,
    SlippageColumnRight,
    Input,
    Span
} from './styles'

export const SlippageBox = ({ onSlippageChange, slippage, slippageEnabled, className }:any) => {
    return (
        <SlippageContainer className={className}>
            <SlippageColumnLeft>Slippage tolerance</SlippageColumnLeft>
            <SlippageColumnRight>
                {
                    slippageEnabled &&
                    <label>
                        <Span>%</Span>
                        <Input onChange={onSlippageChange} value={slippage} type="number" placeholder="%"/>
                    </label>
                }
                {
                    !slippageEnabled &&
                    <div>{slippage} %</div>
                }
            </SlippageColumnRight>
        </SlippageContainer>
    )
}
