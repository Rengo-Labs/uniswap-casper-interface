import React from 'react'
import { ButtonStyle } from './styles'

export const CircularButton = ({ content, handler, style={}, enabled= true}) => {
  return (
    <ButtonStyle enabled={enabled} style={style} onClick={ handler } disabled={!enabled}>
    { content }
    </ButtonStyle>
  )
}
