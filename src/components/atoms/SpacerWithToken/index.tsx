import React from 'react'
import styled from 'styled-components'

const SpacerWithTokenStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all .6;
    &:hover{
        background-color:#E6E6E6;
        cursor: pointer;
    }
`
export const SpacerWithToken = ({children,onClick}) => {
  return (
    <SpacerWithTokenStyled onClick={onClick}>{children}</SpacerWithTokenStyled>
  )
}