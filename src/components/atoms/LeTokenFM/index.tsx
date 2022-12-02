import React from 'react'
import styled from 'styled-components'
const LeToken = styled.div`
    display: flex;
    gap:5px;
    align-items: center;
    font-size: 1rem;
    &:hover{
        cursor: pointer;
    }
`
export const LeTokenFM = ({children,onClick}) => {
  return (
    <LeToken onClick={onClick}>{children}</LeToken>
  )
}
