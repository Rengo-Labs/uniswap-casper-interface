import React from 'react'

import styled from 'styled-components'

const SearchInputStyle = styled.input`
    all:unset;
    width: 100%;
`

export const SearchInput = ({type,name,id,placeholder,onChange}) => {
  return (
    <SearchInputStyle type={type} name={name} id={id} placeholder={placeholder} onChange={onChange}/>
  )
}
