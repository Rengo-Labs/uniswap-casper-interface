import React from 'react'
import {
    SlippageContainer,
    SlippageColumnLeft,
    SlippageColumnRight,
    Input,
    Span
} from './styles'

export const GasFeeBox = ({ onGasFeeChange, gasFee, gasFeeEnabled = false, className }:any) => {
    return (
        <SlippageContainer className={className}>
            <SlippageColumnLeft>Network gas fee</SlippageColumnLeft>
            <SlippageColumnRight>
                {
                    gasFeeEnabled &&
                    <label>
                        <Input onChange={onGasFeeChange} value={gasFee} type="number" placeholder="10"/>
                        <Span>CSPR</Span>
                    </label>
                }
                {
                    !gasFeeEnabled &&
                    <div>{gasFee} CSPR</div>
                }
            </SlippageColumnRight>
        </SlippageContainer>
    )
}
