import React from 'react'

import styled from 'styled-components'
const ExpansionAreaStyled = styled.div<any>`
    width: ${ props => props.theme.OPEN_WIDTH };
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-transform: ${ props => props.collapse ? 'translateX(0)': 'translateX(-100%)' };
    -ms-transform: ${ props => props.collapse ? 'translateX(0)': 'translateX(-100%)' };
    transform: ${ props => props.collapse ? 'translateX(0)': 'translateX(-100%)' };
`
export const ExpansionAreaCC = ({ children, collapse, onMouseEnter }) => {
  return (
    <ExpansionAreaStyled collapse={collapse} onMouseEnter={onMouseEnter}>{children}</ExpansionAreaStyled>
  )
}
