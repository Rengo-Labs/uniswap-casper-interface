import React from 'react'

import { SwapContainer, SwapTokenSelect, SwapTokenBalance } from '../../atoms'
export const SwapSelection = ({ onClickHandler,token }) => {
    return (
        <SwapContainer>
            <SwapTokenSelect onClickHandler={onClickHandler} token={token}></SwapTokenSelect>
            <SwapTokenBalance />
        </SwapContainer>
    )
}
