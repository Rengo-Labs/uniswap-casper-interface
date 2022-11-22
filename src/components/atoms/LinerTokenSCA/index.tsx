import React from 'react'
import styled from 'styled-components'
const LinerTokenStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const LinerTokenSCA = ({children}) => {
  return (
    <LinerTokenStyled>{children}</LinerTokenStyled>
  )
}
