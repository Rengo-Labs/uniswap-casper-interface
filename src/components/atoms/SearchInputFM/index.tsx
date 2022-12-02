import React from 'react'
import styled from 'styled-components'
const SearchInputStyle = styled.input`
    all:unset;
    width: 100%;
`
export const SearchInputFM = ({placeholder,onChange}) => {
  return (
    <SearchInputStyle type="text" name="" id="" placeholder={placeholder} onChange={onChange}/>
  )
}
