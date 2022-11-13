import React from 'react'
import styled from 'styled-components'


const ContainerCenterStyled = styled.div`
    box-sizing: border-box;
    border: 3px solid black;
    width: 29rem;
    padding: 2rem;
    border-radius: 20px;
    background-color: white;
    display: flex;
    flex-direction: column;
    gap:10px;
    z-index: 2;
`

export const ContainerCenter = ({children}) => {
  return (
    <ContainerCenterStyled>{children}</ContainerCenterStyled>
  )
}
