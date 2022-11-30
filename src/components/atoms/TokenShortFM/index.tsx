import React from 'react'
import styled from 'styled-components'
const TokenShortStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;
`
export const TokenShortFM = ({children}) => {
  return (
    <TokenShortStyle>{children}</TokenShortStyle>
  )
}
