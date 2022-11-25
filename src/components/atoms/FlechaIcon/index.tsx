import React from 'react'
import flechaIcon from '../../../assets/newIcons/flecha.svg'

import styled from 'styled-components'

const FlechaStyled = styled.img`
    cursor: pointer;
    &:hover{
        background-color: rgba(150, 150, 150, .5)
    }
`

export const FlechaIcon = ({onClick}) => {
    return (
        <FlechaStyled onClick={onClick}src={flechaIcon} width="25" height="25" />
    )
}
