import React from 'react'
import styled from 'styled-components'
const TokenSelectionStyled = styled.div`
    display: flex;
    align-items: center;
    gap:10px;
`
export const TokenSelectionNSM = ({children}) => {
  return (
    <TokenSelectionStyled>{children}</TokenSelectionStyled>
  )
}
