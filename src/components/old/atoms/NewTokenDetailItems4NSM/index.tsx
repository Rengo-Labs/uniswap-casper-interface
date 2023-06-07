import React from 'react'
import styled from 'styled-components'
const NewTokenDetailItems4Styled = styled.section`
    grid-column: 2/3;
    grid-row: 2/3;
    justify-self: center;
    margin: 0 15px;
`
export const NewTokenDetailItems4NSM = ({children}) => {
  return (
    <NewTokenDetailItems4Styled>{children}</NewTokenDetailItems4Styled>
  )
}
