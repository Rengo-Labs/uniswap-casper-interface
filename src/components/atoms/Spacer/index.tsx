import React from 'react'
import styled from 'styled-components'


const SpacerStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const Spacer = ({children}) => {
  return (
    <SpacerStyled>{children}</SpacerStyled>
  )
}
