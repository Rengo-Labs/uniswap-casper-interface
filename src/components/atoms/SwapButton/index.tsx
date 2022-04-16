import React from 'react'
import { ButtonStyle } from './styles'

export const SwapButton = ({ content, handler }:{content?:any, handler?:any }) => {
  return (
    <ButtonStyle onClick={handler}>
      {content}
    </ButtonStyle>
  )
}
