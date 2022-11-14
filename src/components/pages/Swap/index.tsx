import React from 'react'

import styled from 'styled-components'

import NewLayout from '../../../layout/NewLayout'
import SwapNewModule from '../../organisms/SwapNewModule'

export const Swap = () => {
  return (
    <NewLayout>
      <Container>
        <ModuleSwapStyled>
          <SwapNewModule />
        </ModuleSwapStyled>
      </Container>
    </NewLayout>
  )
}
const ModuleSwapStyled = styled.div`
`

const ContainerStyled = styled.div`
  width: 100%;
  display:grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  background-color: #F7FCFE;
`
function Container({ children }) {
  return (<ContainerStyled>{children}</ContainerStyled>)
}