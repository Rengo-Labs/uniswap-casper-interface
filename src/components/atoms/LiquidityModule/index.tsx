import React from 'react'
import styled from 'styled-components'

const ModuleSwapStyled = styled.div`
  display: flex;
`

export const LiquidityModule = ({children}) => {
  return (
    <ModuleSwapStyled>{children}</ModuleSwapStyled>
  )
}
