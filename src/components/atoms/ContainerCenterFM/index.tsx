import React from 'react'
import styled from 'styled-components'
const ContainerCenter = styled.div`
    box-sizing: border-box;
    border: 2px solid black;
    width: 28.2rem;
    /*padding: 2rem;*/
    border-radius: 20px;
    background-color: white;
    display: flex;
    flex-direction: column;
    height: 36.64rem;
    z-index: 2;
`
export const ContainerCenterFM = ({children}) => {
  return (
    <ContainerCenter>{children}</ContainerCenter>
  )
}
