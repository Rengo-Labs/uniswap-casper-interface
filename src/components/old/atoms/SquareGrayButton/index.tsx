import React from 'react'
import { ButtonStyle } from './styles'

export const SquareGrayButton = ({ content, title, handler, style = {}, enabled = true }) => {
  return (
    <ButtonStyle style={style} >
      <div>{title}</div>
      <div>{content}</div>
    </ButtonStyle>
  )
}
