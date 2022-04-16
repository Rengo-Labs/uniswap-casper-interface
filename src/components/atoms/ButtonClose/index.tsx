import React from 'react'
import { ButtonCloseStyle } from './styles'

export const ButtonClose = ({ onClickHandler, children }) => {
  return (
    <ButtonCloseStyle onClick={() => { onClickHandler() }}>
      {children}
    </ButtonCloseStyle>
  )
}
