import React from 'react'
import styled from 'styled-components'

const ButtonHalfMaxStyled = styled.div<any>`
    background-color: ${props => props.theme.NewPurpleColor};
    color: white;
    padding:10px;
    border-radius: 12px;
    width: 21px;
    height: 12px;
    cursor: pointer;
    font-size: 12px;
`

export const ButtonHalfMax = ({children,onClick}) => {
  return (
    <ButtonHalfMaxStyled onClick={onClick}>{children}</ButtonHalfMaxStyled>
  )
}
