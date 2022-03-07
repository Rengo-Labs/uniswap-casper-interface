import React from 'react'
import { SwapInputStyled, InputStyled, InputContainerStyled, SelectStyled } from './styles'
export const SwapInput = () => {
    return (
        <SwapInputStyled>
            <InputContainerStyled>
                <label htmlFor="amount">From</label>
                <InputStyled id="amount" placeholder="0.00" type="number" />
            </InputContainerStyled>
            <SelectStyled name="swap">
                <option value="value1">Select Token</option>
                <option value="value1">Value 1</option>
                <option value="value1">Value 1</option>
            </SelectStyled>
        </SwapInputStyled>
    )
}
