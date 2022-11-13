import React from 'react'
import styled from 'styled-components'

const ButtonHalfMaxContainerStyled = styled.div`
    border-left: 3px solid ${props => props.theme.NewPurpleColor};
    padding-left:10px;
    display: grid;
    gap:10px;
`

export const ButtonHalfMaxContainer = ({children}) => {
  return (
    <ButtonHalfMaxContainerStyled>{children}</ButtonHalfMaxContainerStyled>
  )
}
