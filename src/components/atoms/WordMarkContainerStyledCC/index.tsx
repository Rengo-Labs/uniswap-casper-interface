import React from 'react'
import styled from 'styled-components'
import { device } from '../../../contexts/ThemeContext/themes'
const WordMarkContainerStyled = styled.nav`
    position: absolute;
    display: block;
    left: 50%;
    top: 0%;
    transform: translate(-50%, 10px);

    & svg > path{
        fill: ${props => props.theme.NewPurpleColor};
    }

    @media ${device.mobileS} {
      position: relative;
    }
    
`
export const WordMarkContainerStyledCC = ({children}) => {
  return (
    <WordMarkContainerStyled>{children}</WordMarkContainerStyled>
  )
}
