import React from 'react'
import {
    SlippageContainer,
    SlippageColumnLeft,
    SlippageColumnRight,
    Input,
    Span
} from './styles'

export const GasFeeBox = ({ onGasFeeChange, gasFee, gasFeeEnabled = false, className }:any) => {

    const onChange = (value) => {
      onGasFeeChange(value.target.value)
    }

    return (
        <SlippageContainer className={className}>
            <SlippageColumnLeft>Network gas fee</SlippageColumnLeft>
            <SlippageColumnRight>
                {
                    gasFeeEnabled &&
                    <label>
                        <Input onChange={onChange} value={gasFee} type="number"/>
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
