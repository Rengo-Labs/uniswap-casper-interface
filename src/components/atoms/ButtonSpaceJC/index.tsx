import React from 'react'
import styled from 'styled-components'
const ButtonSpaceStyled = styled.div`
    justify-self: center;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
`
export const ButtonSpaceJC = ({children}) => {
  return (
    <ButtonSpaceStyled>{children}</ButtonSpaceStyled>
  )
}
