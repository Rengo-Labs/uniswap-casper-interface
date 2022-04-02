import React from 'react'

import { Brand, ActionsBar, NavigationBar } from '../../molecules'

import { NavBarStyle } from './styles'
export const NavBar = ({ children }) => {
  return (
    <NavBarStyle>
      { children }
    </NavBarStyle>
  )
}
