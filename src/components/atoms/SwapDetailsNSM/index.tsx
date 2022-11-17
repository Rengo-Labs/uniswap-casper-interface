import React from 'react'
import styled from 'styled-components'
const SwapDetailsStyled = styled.div`
    font-size:16px;
    color: ${props => props.theme.NewPurpleColor};
`
export const SwapDetailsNSM = ({children}) => {
  return (
    <SwapDetailsStyled>{children}</SwapDetailsStyled>
  )
}
