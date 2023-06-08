import React from 'react'


import { NavBarStyle } from './styles'
export const NavBar = ({ children }) => {
  return (
    <NavBarStyle>
      { children }
    </NavBarStyle>
  )
}
