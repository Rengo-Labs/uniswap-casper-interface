import React from 'react'
import { ButtonStyle } from './styles'

export const SwapButton = ({ content, handler }) => {
  return (
    <ButtonStyle onClick={handler}>
      {content}
    </ButtonStyle>
  )
}
