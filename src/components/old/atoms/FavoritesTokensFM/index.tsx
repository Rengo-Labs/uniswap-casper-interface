import React from 'react'
import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";

const FavoritesTokensStyles = styled.div`
    display: flex;
    gap:1.5rem;
    font-size: 2rem;
    justify-content:center;
    align-items:center;

    @media ${device.tablet} {
      gap:3rem;
  }
    
`

export const FavoritesTokensFM = ({children}) => {
  return (
    <FavoritesTokensStyles>{children}</FavoritesTokensStyles>
  )
}
