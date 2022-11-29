import React from 'react'
import styled from 'styled-components'
const Container = styled.main`
    box-sizing: border-box;
    justify-self:center;
    box-sizing: border-box;
    width: 100%;
    gap:10px;
    color:black;
    display: grid;
    grid-template-columns: auto auto;
    padding: 10px;
`
export const ContainerJC = ({ children}) => {
  return (
    <Container>{ children}</Container>
  )
}
