import React from 'react'
import styled from 'styled-components'
const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    font-family: 'Epilogue'; 
    backdrop-filter: blur(5px);
    background-color: rgba(0,0,0,0.7);
    opacity: 1;
    z-index: 1;
`
export const ContainerFM = ({children}) => {
  return (
    <Container>{children}</Container>
  )
}
