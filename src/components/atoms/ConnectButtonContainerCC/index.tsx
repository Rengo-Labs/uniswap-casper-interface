import React from 'react'
import styled from 'styled-components'
const ConnectButtonContainerStyled = styled.nav`
    position: absolute;
    display: block;
    right: 0;
    min-width: 160px;

    & button {
        width: 100%;
    }
`
export const ConnectButtonContainerCC = ({children}) => {
  return (
    <ConnectButtonContainerStyled>{children}</ConnectButtonContainerStyled>
  )
}
