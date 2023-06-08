import React from 'react'
import styled from 'styled-components'
const NewNavigationStyled = styled.nav`
    background-color: ${props => props.theme.NewNavigationCCBG};
    display: grid;
    padding: 32px 0;
    grid-template: auto 1fr auto / auto;
    justify-items: center;
`
export const NewNavigationCC = ({ children, onMouseLeave }) => {
  return (
    <NewNavigationStyled onMouseLeave={onMouseLeave}>{children}</NewNavigationStyled>
  )
}
