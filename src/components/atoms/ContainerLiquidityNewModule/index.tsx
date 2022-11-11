import React from 'react'
import styled from 'styled-components'

const ContainerLiquidityNewModuleStyled = styled.section`
    justify-self: end;
    padding: 20px 25px 10px 25px;
    border:1px solid black;
    border-radius: 10px;
    display:grid;
    gap:10px;
    grid-template-rows: repeat(6,auto);
`

export const ContainerLiquidityNewModule = ({children}) => {
  return (
    <ContainerLiquidityNewModuleStyled>{children}</ContainerLiquidityNewModuleStyled>
  )
}
