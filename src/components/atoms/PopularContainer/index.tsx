import React from 'react'

import styled from 'styled-components'

const PopularContainerStyled = styled.div`
    color:${props => props.theme.NewPurpleColor};
`

export const PopularContainer = ({children}) => {
  return (
    <PopularContainerStyled>{children}</PopularContainerStyled>
  )
}
