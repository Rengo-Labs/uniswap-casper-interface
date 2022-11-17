import React from 'react'
import styled from 'styled-components'
export const NewTokenDetailSelectStyled = styled.section`
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;
`
export const NewTokenDetailSelectNSM = ({children}) => {
  return (
    <NewTokenDetailSelectStyled>{children}</NewTokenDetailSelectStyled>
  )
}
