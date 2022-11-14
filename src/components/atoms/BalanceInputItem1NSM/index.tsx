import React from 'react'
import styled from 'styled-components'

export const BalanceInputItem1Styled = styled.div`
    align-self: center;
    color:${props => props.theme.NewPurpleColor};
    font-size: 3em;
`

export const BalanceInputItem1NSM = ({children}) => {
  return (
    <BalanceInputItem1Styled>{children}</BalanceInputItem1Styled>
  )
}
