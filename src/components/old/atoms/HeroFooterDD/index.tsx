import React from 'react'
import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";


const HeroFooterDDStyled = styled.div`
  display: flex;
  gap: 1rem;

  @media ${device.mobileS} {
    display: contents;
    flex-direction: row;
  }
  
  @media ${device.tablet} {
    display: flex;
    gap: 1rem;
  }
`
export const HeroFooterDD = ({children}) => {
    return (
        <HeroFooterDDStyled>{children}</HeroFooterDDStyled>
    )
}
