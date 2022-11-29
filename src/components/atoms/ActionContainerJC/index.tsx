import React from 'react'
import styled from 'styled-components'
const ActionContainerStyled = styled.div`
    display: flex;
`
export const ActionContainerJC = ({children}) => {
  return (
    <ActionContainerStyled>{children}</ActionContainerStyled>
  )
}
