import React from 'react'
import styled from 'styled-components'
const ContainerLiquidityPool = styled.section`
    box-sizing: border-box;
    justify-self: start;
    padding:10px;
    border:1px solid black;
    border-radius: 20px;
    display:flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap:10px;
`
export const ContainerLiquidityPoolList = ({children}) => {
  return (
    <ContainerLiquidityPool>{children}</ContainerLiquidityPool>
  )
}
