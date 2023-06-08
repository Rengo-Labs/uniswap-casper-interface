import React from 'react'
import { ButtonStyle } from './styles'

export const LiquidityRemoveButton = ({ testid="", content, handler, enabled= true}) => {
    return (
        <ButtonStyle data-testid={testid} enabled={enabled} onClick={ handler } disabled={!enabled}>
            { content }
        </ButtonStyle>
    )
}
