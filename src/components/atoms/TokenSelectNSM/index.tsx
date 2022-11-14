import React from 'react'
import styled from 'styled-components'

const TokenSelectStyled = styled.div`
    display: flex;
    justify-content: space-between;
`

export const TokenSelectNSM = ({children}) => {
  return (
    <TokenSelectStyled>{children}</TokenSelectStyled>
  )
}
