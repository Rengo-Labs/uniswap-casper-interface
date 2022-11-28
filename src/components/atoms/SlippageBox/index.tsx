import React from 'react'
import {
    SlippageContainer,
    SlippageColumnLeft,
    SlippageColumnRight,
    Input,
    Span
} from './styles'

export const SlippageBox = ({ onSlippageChange, slippage, slippageEnabled = false, className }:any) => {
    return (
        <SlippageContainer className={className}>
            <SlippageColumnLeft>Slippage tolerance</SlippageColumnLeft>
            <SlippageColumnRight>
                {
                    slippageEnabled &&
                    <label>
                        <Input onChange={onSlippageChange} value={slippage} type="number" placeholder="%"/>
                        <Span>%</Span>
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
