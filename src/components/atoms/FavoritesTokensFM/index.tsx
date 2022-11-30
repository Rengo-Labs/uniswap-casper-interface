import React from 'react'
import styled from 'styled-components'

const FavoritesTokensStyles = styled.div`
    display: flex;
    gap:3rem;
    font-size: 2rem;
    justify-content:center;
    align-items:center;
`

export const FavoritesTokensFM = ({children}) => {
  return (
    <FavoritesTokensStyles>{children}</FavoritesTokensStyles>
  )
}
