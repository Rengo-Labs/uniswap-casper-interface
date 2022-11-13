import React from 'react'

import styled from 'styled-components'

const IconContainerStyled = styled.div`
    cursor: pointer;
`
const TokenShortStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;
`
export const TokenShort = ({children}) => {
  return (
    <TokenShortStyle>{children}</TokenShortStyle>
  )
}
