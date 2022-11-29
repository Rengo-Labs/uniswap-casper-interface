import React from 'react'
import styled from 'styled-components'
const NewTokenDetailItems3Styled = styled.section`
    grid-column: 1/2;
    grid-row: 3/4;
    justify-self: center;
` 
export const NewTokenDetailItems3JC = ({children}) => {
  return (
    <NewTokenDetailItems3Styled>{children}</NewTokenDetailItems3Styled>
  )
}
