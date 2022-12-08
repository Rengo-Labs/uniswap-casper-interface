import React from 'react'
import styled from 'styled-components'
export const BalanceInputItem1Styled = styled.div`
    align-self: center;
    color:${props => props.theme.NewPurpleColor};
    font-size: 3em;
    margin: 15px 0;
`
export const BalanceInputItem1NSM = ({children}) => {
  return (
    <BalanceInputItem1Styled>{children}</BalanceInputItem1Styled>
  )
}
