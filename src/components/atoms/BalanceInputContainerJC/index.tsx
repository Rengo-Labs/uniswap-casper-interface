import React from 'react'
import styled from 'styled-components'
const BalanceInputContainerStyled = styled.div`
    width: 100%;
    display: grid;
    grid-template-rows: auto auto;
    justify-items: end;
    gap:10px;
`
export const BalanceInputContainerJC = ({children}) => {
  return (
    <BalanceInputContainerStyled>{children}</BalanceInputContainerStyled>
  )
}
