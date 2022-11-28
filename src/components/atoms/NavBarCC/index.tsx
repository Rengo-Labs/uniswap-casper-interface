import React from 'react'
import styled from 'styled-components'
const NavBarStyled = styled.nav`
    position: relative;
    margin: 30px 30px 80px;
    height: 20px;
`
export const NavBarCC = ({children}) => {
  return (
    <NavBarStyled>{children}</NavBarStyled>
  )
}
