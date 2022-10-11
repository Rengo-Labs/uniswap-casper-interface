import React from 'react'
import SwitchSwapIcon from '../../../assets/newIcons/switchSwap.svg'
import styled from 'styled-components'
const SwitchSwap = ({ onClick }) => {
    return (
        <IconStyled src={SwitchSwapIcon} width="50" height="50" onClick={()=>{onClick()}} />)
}

const IconStyled = styled.img`
    cursor: pointer;
`

export default SwitchSwap