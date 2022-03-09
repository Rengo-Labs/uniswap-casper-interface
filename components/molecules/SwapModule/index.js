import React from 'react'
import { SwapButton,SwitchIcon } from '../../atoms'
import { SwapInput } from '../SwapInput'
import { SwapModulesStyled } from './styles'

export const SwapModule = () => {
    return (
        <SwapModulesStyled>
            <SwapInput />
            <SwitchIcon />
            <SwapInput />
            <SwapButton content="Connect to Wallet"></SwapButton>
        </SwapModulesStyled>
    )
}
