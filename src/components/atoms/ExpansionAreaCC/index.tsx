import React from 'react'

import styled from 'styled-components'
const ExpansionAreaStyled = styled.div<any>`
    width: ${props => props.collapse ? props.theme.OPEN_WIDTH : 0};
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
`
export const ExpansionAreaCC = ({ children, collapse, onMouseEnter }) => {
  return (
    <ExpansionAreaStyled collapse={collapse} onMouseEnter={onMouseEnter}>{children}</ExpansionAreaStyled>
  )
}
