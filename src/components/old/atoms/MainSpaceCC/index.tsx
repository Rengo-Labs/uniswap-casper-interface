import React from 'react'
import styled from 'styled-components'
const MainSpaceStyled = styled.main`
    background-color: rgba(247,252,253,255);
    height:100%;
    width:100%;
    display:grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
`
export const MainSpaceCC = ({children}) => {
  return (
<MainSpaceStyled>{children}</MainSpaceStyled>  )
}
