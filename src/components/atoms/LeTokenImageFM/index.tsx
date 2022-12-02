import React from 'react'
import styled from 'styled-components'
const LeTokenImage = styled.img`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
`
export const LeTokenImageFM = ({src}) => {
  return (
    <LeTokenImage src={src} alt=""/>
  )
}
