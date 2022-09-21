import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface SwapModalStyledInterface {
    isActive?: any
}
export const SwapModalStyled = styled.div<SwapModalStyledInterface>`
    width: 100vw;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-color:${prop => prop.theme.StrongColor4};
    display: grid;
    place-items: center;
    display:${prop => prop.isActive};
`

export const SwapModal = ({ children }: { children: ReactNode }) => {

    return (
        <SwapModalStyled>
            {children}
        </SwapModalStyled>
    )
}
