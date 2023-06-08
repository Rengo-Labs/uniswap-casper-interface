import React from 'react'
import styled from 'styled-components'
const NewTokenDetailActionsStyled = styled.section`
    width: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
`
export const NewTokenDetailActionsNSM = ({children}) => {
  return (
    <NewTokenDetailActionsStyled>{children}</NewTokenDetailActionsStyled>
  )
}
