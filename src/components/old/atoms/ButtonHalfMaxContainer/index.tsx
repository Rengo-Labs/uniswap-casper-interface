import React from 'react'
import styled from 'styled-components'

const ButtonHalfMaxContainerStyles = styled.div`
    border-left: 1px solid ${props => props.theme.NewGreyColor};
    padding-left:10px;
    display: grid;
    gap:5px;
    margin: 20px 0px;
`

export const ButtonHalfMaxContainer = ({children}) => {
  return (
    <ButtonHalfMaxContainerStyles>{children}</ButtonHalfMaxContainerStyles>
  )
}
