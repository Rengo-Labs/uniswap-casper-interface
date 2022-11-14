import React from 'react'
import styled from 'styled-components'
const NewSwapContainer = styled.section`
    background-color:white;
    box-sizing: border-box; 
    justify-self: center;
    height: 8rem;
    padding: 1rem;
    border:1px solid black;
    border-radius: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
`
export const NewSwapContainerNSM = ({children}) => {
  return (
    <NewSwapContainer>{children}</NewSwapContainer>
  )
}
