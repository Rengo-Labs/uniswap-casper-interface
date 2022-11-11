import React from 'react'

import styled from 'styled-components'

const IconContainerStyled = styled.div`
    cursor: pointer;
`
export const IconContainer = ({children,onClick}) => {
  return (
    <IconContainerStyled onClick={onClick}>{children}</IconContainerStyled>
  )
}
