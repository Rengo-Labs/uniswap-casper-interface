import React from 'react'
import SwitchSwapIcon from '../../../assets/newIcons/loaders.svg'
import styled from 'styled-components'

const IconStyled = styled.img`
    width: 1.5rem;
    height: 1.5rem;
`

export const LoadersSwap = () => {
  return (
    <IconStyled src={SwitchSwapIcon} onClick={()=>{}} />
    )
}