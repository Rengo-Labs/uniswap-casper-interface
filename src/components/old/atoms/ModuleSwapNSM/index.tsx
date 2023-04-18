import React from 'react'
import styled from 'styled-components'
const ModuleSwapStyled = styled.div`
padding-bottom: 1rem;
`

export const ModuleSwapNSM = ({children}) => {
  return (
    <ModuleSwapStyled>{children}</ModuleSwapStyled>
  )
}
