import React from 'react'
import styled from 'styled-components'
const ButtonHalfMaxStyle = styled.div<any>`
    background-color: ${props => props.theme.NewPurpleColor};
    color: white;
    padding: 0px 5px;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const ButtonHalfMax = ({children,onClick}) => {
  return (
    <ButtonHalfMaxStyle onClick={onClick}>{children}</ButtonHalfMaxStyle>
  )
}
