import React from 'react'

import styled from 'styled-components'

const SearchStyle = styled.div`
    border: 1px solid black;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    justify-content:space-between;
    align-items:center;
`

export const Search = ({children}) => {
  return (
    <SearchStyle>{children}</SearchStyle>
  )
}
