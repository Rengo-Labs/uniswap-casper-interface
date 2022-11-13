import React from 'react'
import styled from 'styled-components'
const LeTokenImageStyled = styled.img`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
`
export const LeTokenImage = ({src}) => {
  return (
    <LeTokenImageStyled alt="" src={src} />
  )
}
