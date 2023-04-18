import React from 'react'
import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";

const HeroSubtitle = styled.h2`
  font-family: EpilogueLight;
  font-size: 28px;
  
  @media ${device.mobileS} {
    font-size: 22px;
  }
  @media ${device.mobileM} {
    font-size: 22px;
  }
  @media ${device.mobileL} {
    font-size: 28px;
  }
`
export const HeroSubtitleDD = ({children}) => {
  return (
    <HeroSubtitle>{children}</HeroSubtitle>
  )
}
