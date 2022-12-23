import React from 'react'
import styled from 'styled-components'

const HeroHeaderDDStyled = styled.div`
text-align: center;
`
export const HeroHeaderDD = ({ children }) => {
    return (
        <HeroHeaderDDStyled>{children}</HeroHeaderDDStyled>
    )
}
