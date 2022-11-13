import React from 'react'
import styled from 'styled-components'
const SelectTokenImageStyled = styled.img`
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
`
export const SelectTokenImage = ({src}) => {
  return (
    <SelectTokenImageStyled alt="" src={src}/>
    )
}
