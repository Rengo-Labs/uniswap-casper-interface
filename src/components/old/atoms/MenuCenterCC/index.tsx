import React from 'react'
import styled from 'styled-components'

const MenuCenterStyled = styled.main`
    width: 100%;
    align-self: center;
`

export const MenuCenterCC = ({children}) => {
    return (
        <MenuCenterStyled>{children}</MenuCenterStyled>
    )

}
