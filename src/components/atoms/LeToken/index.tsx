import React from 'react'
import styled from 'styled-components'
const LeTokenStyled = styled.div`
    display: flex;
    gap:5px;
    align-items: center;
    font-size: 1rem;
    &:hover{
        background-color:aquamarine;
        cursor: pointer;
    }
`
export const LeToken = ({children,onClick}) => {
  return (
    <LeTokenStyled onClick={onClick}>{children}</LeTokenStyled>
  )
}
