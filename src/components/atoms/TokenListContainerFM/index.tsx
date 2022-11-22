import React from 'react'
import styled from 'styled-components'
const TokenListContainerStyled = styled.div<any>`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 332px;
    display: grid;
    gap:10px;
`
export const TokenListContainerFM = ({children}) => {
  return (
    <TokenListContainerStyled>{children}</TokenListContainerStyled>
  )
}
