import React from 'react'
import styled from 'styled-components'
const SelectTokenImage = styled.img`
    border-radius: 50%;
    width: 35px;
    height: 35px;
`
export const SelectTokenImageFM = ({src}) => {
  return (
    <SelectTokenImage src={src} alt="" />
  )
}
