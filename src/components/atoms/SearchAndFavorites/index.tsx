import React from 'react'
import styled from 'styled-components'

const SearchAndFavoritesStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap:10px;

`
export const SearchAndFavorites = ({children}) => {
  return (
    <SearchAndFavoritesStyled>{children}</SearchAndFavoritesStyled>
  )
}
