import React from 'react'

import { SwapTokenStyled } from './styles'

export const SwapToken = ({icon="", token="",amount=""}) => {
    return (
        <SwapTokenStyled>
            <div>ICON</div>
            <div>
                <p>NAME</p>
                <p>ACRONYM</p>
            </div>
            <div>AMOUNT</div>
        </SwapTokenStyled>
    )
}
