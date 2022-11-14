import React from 'react'
import styled from 'styled-components'
const ContainerSwapActionsStyles = styled.section`
    justify-self: end;
    box-sizing: border-box;
    width: 462px;
    border:1px solid black;
    border-radius: 20px;
    display:grid;
    flex-direction: column;
    justify-content:center;
    align-items: center;
    gap:10px;
    padding: 20px 25px;
    z-index: 3;
`
export const ContainerSwapActions = ({children}) => {
  return (
    <ContainerSwapActionsStyles>{children}</ContainerSwapActionsStyles>
  )
}
