import React from 'react'
import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";

const LayoutStyled = styled.div<any>`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: ${props => props.collapse ? props.theme.CLOSED_WIDTH + " auto" : props.theme.OPEN_WIDTH + " auto"};
    grid-template-rows: 1fr;
    transition: all 500ms ease;

    @media ${device.mobileS} {
      grid-template-columns: ${props => props.collapse ? "70px" + " auto" : "240px" + " auto"};
    }
    @media ${device.mobileM} {
      grid-template-columns: ${props => props.collapse ? "70px" + " auto" : "240px" + " auto"};
    }
    @media ${device.tablet} {
      grid-template-columns: ${props => props.collapse ? props.theme.CLOSED_WIDTH + " auto" : props.theme.OPEN_WIDTH + " auto"};
    }
`

export const LayoutStyledCC = ({children,collapse}) => {
  return (
    <LayoutStyled collapse={collapse}>{children}</LayoutStyled>
  )
}
