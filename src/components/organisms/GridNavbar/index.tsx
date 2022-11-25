import React from 'react'


import { NavBarStyle } from './styles'
export const GridNavbar = ({ children }) => {
  return (
    <NavBarStyle>
      { children }
    </NavBarStyle>
  )
}
