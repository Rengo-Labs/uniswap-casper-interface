import React from 'react'
import styled from 'styled-components'
const CollapseButtonStyled = styled.button`
    all:unset;
`
export const CollapseButtonCC = ({children}) => {
  return (
<CollapseButtonStyled>{children}</CollapseButtonStyled>  )
}
