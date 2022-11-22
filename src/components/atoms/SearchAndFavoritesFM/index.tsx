import React from 'react'
import styled from 'styled-components'
const SearchAndFavoritesStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap:12px;
    padding: 12px 2rem 0 2rem;
    height: 155px;
`
export const SearchAndFavoritesFM = ({children}) => {
  return (
    <SearchAndFavoritesStyled>{children}</SearchAndFavoritesStyled>
  )
}
