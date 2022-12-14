import React from 'react'
import styled from 'styled-components'

const LiquidityNewContainer = styled.div`
  display: flex;
`
export const LiquidityNewContainerCC = ({children}) => {
  return (
    <LiquidityNewContainer>{children}</LiquidityNewContainer>
  )
}
