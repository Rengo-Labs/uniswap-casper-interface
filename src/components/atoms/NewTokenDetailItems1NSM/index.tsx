import React from 'react'
import styled from 'styled-components'
const NewTokenDetailItems1Styled = styled.section`
    grid-column: 1/2;
    grid-row: 1/2;
    justify-self: center;
`
export const NewTokenDetailItems1NSM = ({children}) => {
  return (
    <NewTokenDetailItems1Styled>{children}</NewTokenDetailItems1Styled>
  )
}
