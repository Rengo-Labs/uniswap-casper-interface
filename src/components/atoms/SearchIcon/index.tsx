import React from 'react'
import styled from 'styled-components'
const SearchIconStyle = styled.div`
    color:${props => props.theme.NewPurpleColor};
    background-color: ${props => props.theme.NewAquamarineColor};
    display:grid;
    place-items:center;
    border-radius:50%;
    font-size:1.5rem;
`
export const SearchIcon = ({children}) => {
  return (
    <SearchIconStyle>{children}</SearchIconStyle>
  )
}
