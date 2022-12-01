import React from 'react'
import { LiquidityButtonStyle } from './styles'

export const LiquidityButton = ({ content, handler, enabled= true}) => {
    return (
        <LiquidityButtonStyle enabled={enabled} onClick={ handler } disabled={!enabled}>
            { content }
        </LiquidityButtonStyle>
    )
}
