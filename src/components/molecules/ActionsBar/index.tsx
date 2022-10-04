import React from 'react'
import { ActionsStyles } from './styles'

export const ActionsBar = ({ children }) => {
  return (
    <ActionsStyles>
      { children }
    </ActionsStyles>
  )
}
