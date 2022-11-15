import React from 'react'
import styled from 'styled-components'
const NewBalanceSpace = styled.section`
    justify-self:end;
`
export const NewBalanceSpaceNSM = ({children}) => {
  return (
    <NewBalanceSpace>{children}</NewBalanceSpace>
  )
}
