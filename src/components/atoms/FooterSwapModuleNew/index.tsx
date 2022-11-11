import React from 'react'
import styled from 'styled-components'

const FooterStyled = styled.div`
    justify-self:center;
    align-self:center;
    color: ${props => props.theme.NewPurpleColor};
`

export const FooterSwapModuleNew = ({children}) => {
  return (
    <FooterStyled>{children}</FooterStyled>
  )
}
