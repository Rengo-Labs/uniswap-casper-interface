import React from 'react'
import styled from 'styled-components'

export const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
`
export const ContainerSwapModuleNew = ({children}) => {
  return (
    <Container>{children}</Container>
  )
}