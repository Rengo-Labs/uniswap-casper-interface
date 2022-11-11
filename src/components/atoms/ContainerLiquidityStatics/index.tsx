import React from 'react'
import styled from 'styled-components'

const ContainerLiquidityStaticsStyled = styled.section`
    box-sizing: border-box;
    justify-self: start;
    padding:10px;
    border:1px solid black;
    border-radius: 10px;
    display:flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap:10px;
`

export const ContainerLiquidityStatics = ({children}) => {
  return (
    <ContainerLiquidityStaticsStyled>{children}</ContainerLiquidityStaticsStyled>
  )
}
