import React, { ReactNode } from 'react'
import { IButtonProps } from '../Button'
import { ButtonStyle } from './styles'

export const SquareButton = ({ content, handler, style={}, enabled=true}: IButtonProps) => {
  return (
    <ButtonStyle enabled={enabled} style={style} onClick={ handler } disabled={!enabled}>
    { content }
    </ButtonStyle>
  )
}
