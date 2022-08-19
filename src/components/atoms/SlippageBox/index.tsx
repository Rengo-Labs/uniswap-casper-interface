import React from 'react'
import {AiOutlineSwap} from "react-icons/ai"
import {
    SlippageContainer,
    SlippageColumnLeft,
    SlippageColumnRight,
    Input,
    Span
} from './styles'

export const SlippageBox = ({ onSlippageChange, slippage, className }:any) => {
    return (
        <SlippageContainer className={className}>
            <SlippageColumnLeft>Slippage tolerance</SlippageColumnLeft>
            <SlippageColumnRight>
                <label>
                    <Span>%</Span>
                    <Input name="Lastname" onChange={onSlippageChange} value={slippage} type="number" placeholder="%"/>
                </label>
            </SlippageColumnRight>
        </SlippageContainer>
    )
}
