import React from 'react'
import styled from 'styled-components'

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    color: ${props => props.theme.NewPurpleColor};
`
export const HeaderSwapNewModule = ({children}) => {
  return (
    <HeaderStyled>{children}</HeaderStyled>
  )
}
