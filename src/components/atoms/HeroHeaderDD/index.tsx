import React from 'react'
import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

const HeroHeaderDDStyled = styled.div`
  text-align: center;
  width: 86.3125em;
  height: 8.875em;

  @media ${device.mobileS} {
    width: auto;
    height: auto;
    padding: 1.5em 0;  
  }

  @media ${device.mobileM} {
    width: auto;
    height: auto;
  }

  @media ${device.mobileL} {
    width: auto;
    height: auto;
  }

  @media ${device.tablet} {
    width: auto;
    height: auto;
  }

  @media ${device.laptop} {
    width: auto;
    height: auto;
  }

  @media ${device.laptopL} {
    width: 86.3125em;
    height: 8.875em;
  }
`
export const HeroHeaderDD = ({children}) => {
    return (
        <HeroHeaderDDStyled>{children}</HeroHeaderDDStyled>
    )
}
