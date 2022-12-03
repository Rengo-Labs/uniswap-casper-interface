import React from 'react'
import styled from 'styled-components'
const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    font-family: 'Epilogue'; 
`
export const ContainerFM = ({children}) => {
  return (
    <Container>{children}</Container>
  )
}
