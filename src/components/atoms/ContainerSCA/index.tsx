import React from 'react'
import styled from 'styled-components'
const ContainerStyled = styled.div`
    display:grid;
    gap:10px;
    background-color:white;
`
export const ContainerSCA = ({children}) => {
  return (
    <ContainerStyled>{children}</ContainerStyled>
  )
}
