import React from 'react'
import { SwapButton, SwitchIcon } from '../../atoms'
import { SwapInput } from '../SwapInput'
import { TokenReadySwap } from '../TokenReadySwap'
import { SwapModulesStyled } from './styles'

export const SwapModule = ({ tokenOne = ''}) => {
    return (
        <SwapModulesStyled>
            {tokenOne === '' ? <SwapInput /> : <TokenReadySwap />}
            <SwitchIcon />
            <SwapInput />
            <SwapButton content="Connect to Wallet"></SwapButton>
        </SwapModulesStyled>
    )
}
