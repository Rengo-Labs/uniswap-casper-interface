import React from 'react'
import { ButtonStyle } from './styles'

export const Button = ({ content,handler }) => {
    return (
        <ButtonStyle onClick={handler}>
            {content}
        </ButtonStyle>
    )
}
