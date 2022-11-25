import React from 'react'
import styled from 'styled-components'

const LayoutStyled = styled.div<any>`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: ${props => props.collapse ? props.theme.CLOSED_WIDTH + " auto" : props.theme.OPEN_WIDTH + " auto"};
    grid-template-rows: 1fr;
    transition: all 500ms ease;
`

export const LayoutStyledCC = ({children,collapse}) => {
  return (
    <LayoutStyled collapse={collapse}>{children}</LayoutStyled>
  )
}
