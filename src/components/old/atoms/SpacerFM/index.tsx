import React from 'react'
import styled from 'styled-components'
const SpacerStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 2rem 0 2rem;
    font-size: 16px;
    color: ${props => props.theme.NewPurpleColor};
`
export const SpacerFM = ({children}) => {
  return (
    <SpacerStyled>{children}</SpacerStyled>
  )
}
