import React from 'react'
import { IButtonProps } from '../Button'
import { LiquidityButtonStyle } from './styles'

export const LiquidityButton = ({ content, handler, enabled= true}: IButtonProps) => {
    return (
        <LiquidityButtonStyle enabled={enabled} onClick={ handler } disabled={!enabled}>
            { content }
        </LiquidityButtonStyle>
    )
}
