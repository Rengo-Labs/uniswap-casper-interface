import React from 'react'
import NewLayout from '../../../layout/NewLayout'
import styled from 'styled-components'
import {LiquidityNewModule} from '../../organisms/LiquidityNewModule'
export const NewLiquidity = () => {
    return (
        <NewLayout>
            <Container>
                <ModuleSwapStyled>
                    <LiquidityNewModule />
                </ModuleSwapStyled>
            </Container>
        </NewLayout>
    )
}
const ModuleSwapStyled = styled.div`
  display: flex;
`

const SwapLiquidityButtonStyled = styled.button`
  border-radius:10px;
 
`
function SwapLiquidityButton({ children }) {
  return (<SwapLiquidityButtonStyled>{children}</SwapLiquidityButtonStyled>)
}

const SwapLiquidityContainerStyled = styled.div`
  border: 1px solid black;
  border-radius:10px;
  display: grid;
  grid-template:auto / repeat(3,1fr);
`
function SwapLiquidityContainer({ children }) {
  return (<SwapLiquidityContainerStyled>{children}</SwapLiquidityContainerStyled>)
}

const SwapLiquidityStyled = styled.div`
  justify-self: center;
  width: 12%;
`
function SwapLiquidity({ children }) {
  return (<SwapLiquidityStyled>{children}</SwapLiquidityStyled>)
}
const ContainerStyled = styled.div`
  width: 100%;
  display:grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
`
function Container({ children }) {
  return (<ContainerStyled>{children}</ContainerStyled>)
}