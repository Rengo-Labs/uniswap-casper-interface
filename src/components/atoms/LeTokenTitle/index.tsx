import React from 'react'
import styled from 'styled-components'

const LeTokenTitleStyled = styled.h1`
    font-size: .8rem;
    color: #4D4D4D;
`

export const LeTokenTitle = ({children}) => {
  return (
    <LeTokenTitleStyled>{children}</LeTokenTitleStyled>
  )
}
