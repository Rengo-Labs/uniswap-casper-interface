import React from 'react'
import { ButtonStyle } from './styles'

export const Button = ({ content, handler, style={} }) => {
  return (
    <ButtonStyle style={style} onClick={ handler } >
    { content }
    </ButtonStyle>
  )
}
