import React from 'react'
import styled from 'styled-components'

const TokenListContainerStyled = styled.div<any>`
    padding: 10px;
    display: grid;
    gap:10px;
`

export const TokenListContainer = ({children}) => {
  return (
    <TokenListContainerStyled>{children}</TokenListContainerStyled>
  )
}
