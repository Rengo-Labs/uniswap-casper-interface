import React from 'react'
import styled from 'styled-components'

const HeroFooterDDStyled = styled.div`
display: flex;
gap:1rem;
`
export const HeroFooterDD = ({ children }) => {
    return (
        <HeroFooterDDStyled>{children}</HeroFooterDDStyled>
    )
}
