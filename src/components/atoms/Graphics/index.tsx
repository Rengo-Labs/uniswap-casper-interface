import React from 'react'
import graphics from '../../../assets/newIcons/graphics.svg'
import styled from 'styled-components'



const IconStyled = styled.img`
`

export const Graphics = () => {
  return (
    <IconStyled src={graphics} width="50" height="50" />
    )
}
