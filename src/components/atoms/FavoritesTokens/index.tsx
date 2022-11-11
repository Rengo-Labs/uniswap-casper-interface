import React from 'react'
import styled from 'styled-components'

const FavoritesTokensStyles = styled.div`
    display: flex;
    gap:10px;
    font-size: 2rem;
    justify-content:space-between;
    align-items:center;
`

export const FavoritesTokens = ({children}) => {
  return (
    <FavoritesTokensStyles>{children}</FavoritesTokensStyles>
  )
}
