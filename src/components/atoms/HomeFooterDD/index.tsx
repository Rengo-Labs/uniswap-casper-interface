import React from 'react'
import styled from 'styled-components'

export const HomeFooterDDStyled = styled.footer`
    box-sizing: border-box;
    padding:1rem;
    place-self: center;
    display: flex;
    gap:2rem;
`
export const HomeFooterDD = ({children}) => {
  return (
    <HomeFooterDDStyled>{children}</HomeFooterDDStyled>
  )
}
