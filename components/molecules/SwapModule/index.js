import React from 'react'
import { SwapInput, SwapButton } from '../../atoms'
import { SwapModulesStyled } from './styles'
import { AiOutlineSync } from "react-icons/ai";

export const SwapModule = () => {
    return (
        <SwapModulesStyled>
            <SwapInput />
            <AiOutlineSync size="2rem"/>
            <SwapInput />
            <SwapButton content="Connect to Wallet"></SwapButton>
        </SwapModulesStyled>
    )
}
