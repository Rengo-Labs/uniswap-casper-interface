import React from 'react'
import { ButtonStyle } from './styles'

export const LiquidityRemoveButton = ({ content, handler, enabled= true}) => {
    return (
        <ButtonStyle enabled={enabled} onClick={ handler } disabled={!enabled}>
            { content }
        </ButtonStyle>
    )
}
