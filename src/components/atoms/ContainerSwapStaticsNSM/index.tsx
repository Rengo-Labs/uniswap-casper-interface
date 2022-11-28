import React from 'react'
import styled from 'styled-components'
const ContainerSwapStatics = styled.section`
    justify-self: start;
    box-sizing: border-box;
    width: 29rem;
    height: 10rem;
    padding:2rem;
    border:1px solid black;
    border-radius: 20px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap:10px;
    z-index: 1;
`
export const ContainerSwapStaticsNSM = ({children}) => {
  return (
    <ContainerSwapStatics>{children}</ContainerSwapStatics>
  )
}