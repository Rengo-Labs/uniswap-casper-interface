import React from 'react'
import styled from 'styled-components'
const ContainerTokenStyled = styled.div`
    padding: 10px;
`
export const ContainerTokenSCA = ({children}) => {
  return (
    <ContainerTokenStyled>{children}</ContainerTokenStyled>
  )
}
