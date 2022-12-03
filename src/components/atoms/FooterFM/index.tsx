import React from 'react'
import styled from 'styled-components'
const FooterStyled = styled.div`
    align-self: center;
    justify-self: center;
    display: flex;
    align-items: center;
    padding: 10px;
    color: ${props => props.theme.NewPurpleColor};
    height: 34px;
`
export const FooterFM = ({children}) => {
  return (
    <FooterStyled>{children}</FooterStyled>
  )
}
