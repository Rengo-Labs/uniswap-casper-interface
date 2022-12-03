import React from 'react'
import styled from 'styled-components'

const PopularTokenStyled = styled.div`
    font-size: 16px;
`

export const PopularTokenFM = ({children}) => {
  return (
    <PopularTokenStyled>{children}</PopularTokenStyled>
  )
}
