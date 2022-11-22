import React from 'react'
import styled from 'styled-components'
const InnerTokenStyled = styled.div`
    display: flex;
    align-items: center;
    gap:10px;
`
export const InnerTokenSCA = ({children}) => {
  return (
    <InnerTokenStyled>{children}</InnerTokenStyled>
  )
}
