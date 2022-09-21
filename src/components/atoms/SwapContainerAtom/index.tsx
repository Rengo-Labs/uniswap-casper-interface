import React, { ReactNode } from 'react'
import styled from 'styled-components'

export const SwapContainerStyled = styled.section<any>`
    box-sizing: border-box;
    padding: .5rem;
    width:30%;
    padding-bottom: 4vh;
    background-color:${prop => prop.theme.StrongColor2};
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    color: white;
    display: flex;
    gap:1rem;
    display:${prop => prop.isActive};
    flex-direction: column;
    align-items: center;
    border-radius:10px;
`
export const SwapContainerAtom = ({ children }: { children: ReactNode }) => {
    return (
        <SwapContainerStyled>{ children }</SwapContainerStyled>
    )
}
