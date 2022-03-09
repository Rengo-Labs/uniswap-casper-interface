import React from 'react'
import { SwapButton,SwitchIcon } from '../../atoms'
import { SwapModulesStyled } from './styles'

export const LiquidityModule = () => {
    return (
        <SwapModulesStyled>
            <SwapButton content="Connect to Wallet"></SwapButton>
            <p>If you staked your LP tokens in a farm,<br></br>unstake them to see them here.</p>
        </SwapModulesStyled>
    )
}
