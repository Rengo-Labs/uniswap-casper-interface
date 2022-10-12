import React from 'react'
import octoPurple from '../../../assets/newIcons/octoPurple.svg'
import styled from 'styled-components'
const OctoPurple = () => {
    return (
        <IconStyled src={octoPurple} width="50" height="50" />)
}

const IconStyled = styled.img`
    cursor: pointer;
`

export default OctoPurple