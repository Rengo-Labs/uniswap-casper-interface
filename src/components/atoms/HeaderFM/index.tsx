import React from 'react'
import styled from 'styled-components'
const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    color: ${props => props.theme.NewPurpleColor};
    padding: 10px 2rem;
    align-items: center;
    height: 34px;
`
export const HeaderFM = ({children}) => {
  return (
    <HeaderStyled>{children}</HeaderStyled>
  )
}
