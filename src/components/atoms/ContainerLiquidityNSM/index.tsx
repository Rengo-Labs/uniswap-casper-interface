import React from 'react'
import styled from 'styled-components'
const ContainerLiquidityStyles = styled.main`
    box-sizing: border-box;
    height:100%;
    width: 100%;
    gap:10px;
    padding:10px;
    color:black;
    display: grid;
    grid-template-columns: repeat(2,auto);
    align-items: start;
`
export const ContainerLiquidityNSM = ({children}) => {
  return (
    <ContainerLiquidityStyles>{children}</ContainerLiquidityStyles>
  )
}
