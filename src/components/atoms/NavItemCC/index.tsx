import React from 'react'
import styled from 'styled-components'

const NavItemStyled = styled.nav<any>`
    box-sizing: border-box;
    width: 100%;
    padding: 10px 1.2em;
    cursor: pointer;
    display: flex;
    gap: ${props => props.collapse ? "0" : "40px"};
    justify-content: center;
    align-items: center;
    transition: all 100ms ease;
    
    & svg {
        stroke: white;
        fill: white;
        transition: all 100ms ease;
    }

    &:hover {
        background-color: white;
        color: ${props => props.theme.NewPurpleColor};

        svg {
            stroke: ${props => props.theme.NewPurpleColor};
            fill:${props => props.theme.NewPurpleColor};
        }
    }
`

export const NavItemCC = ({ children, redirect, collapse }) => {
  return (
    <NavItemStyled
        onClick={redirect}
        collapse={collapse}
    >
        {children}
    </NavItemStyled>
  )
}
