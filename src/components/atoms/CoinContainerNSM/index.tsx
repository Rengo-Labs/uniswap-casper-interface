import React from 'react'
import styled from 'styled-components'
const CoinContainerStyled = styled.div`
    width: 27rem;
    height: 3.5rem;
    background-color: white;
    box-sizing: border-box;
    border:1px solid black;
    border-radius: 20px;
    padding:10px;
    display: flex;
    gap:10px;
    align-items: center;
`
export const CoinContainerNSM = ({children}) => {
  return (
    <CoinContainerStyled>{children}</CoinContainerStyled>
  )
}
