import React from 'react'

import { SwapContainer, SwapTokenSelect, SwapTokenBalance } from '../../atoms'

interface SwapSelectionPropsInterface { onClickHandler: () => void, token: string }

export const SwapSelection = ({ onClickHandler, token }: SwapSelectionPropsInterface) => {
    return (
        <SwapContainer>
            <SwapTokenSelect onClickHandler={onClickHandler} token={token}></SwapTokenSelect>
            <SwapTokenBalance />
        </SwapContainer>
    )
}
