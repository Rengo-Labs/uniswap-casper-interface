import React from 'react'
import styled from 'styled-components'
const LeTokenTitle = styled.h1`
    font-size: .8rem;
    color: #4D4D4D;
`
export const LeTokenTitleFM = ({children}) => {
  return (
    <LeTokenTitle>{children}</LeTokenTitle>
  )
}
