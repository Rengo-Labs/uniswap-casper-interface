import React from 'react'
import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

const HeroTitle = styled.h1`
  font-family: Epilogue;
  font-size: 85.25px;
  padding: 15px 0;
  
  @media ${device.mobileS} {
    font-size: 45.25px;
  }
  
  @media ${device.mobileM} {
    font-size: 45.25px;
  }
  
  @media ${device.mobileL} {
    font-size: 50.25px;
  }

  @media ${device.tablet} {
    font-size: 85.25px;
  }
`
export const HeroTitleDD = ({children}) => {
  return (
    <HeroTitle>{children}</HeroTitle>
  )
}
