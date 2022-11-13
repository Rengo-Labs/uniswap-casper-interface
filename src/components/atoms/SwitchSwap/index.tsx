import React from 'react'
import SwitchSwapIcon from '../../../assets/newIcons/switchSwap.svg'
import styled from 'styled-components'


const IconStyled = styled.img`
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;
`

export const SwitchSwap = ({onClick}) => {
    return (
        <IconStyled src={SwitchSwapIcon} onClick={()=>{onClick()}} />)
}
