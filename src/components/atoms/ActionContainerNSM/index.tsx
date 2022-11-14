import React from 'react'
import styled from 'styled-components'
export const ActionContainerStyled = styled.div`
    display: flex;
`
export const ActionContainerNSM = ({children}) => {
  return (
    <ActionContainerStyled>{children}</ActionContainerStyled>
  )
}
