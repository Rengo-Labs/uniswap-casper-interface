import React from 'react'
import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const HomeFooterDDStyled = styled.footer`
    box-sizing: border-box;
    padding:1rem;
    place-self: center;
    display: flex;
    gap:2rem;
  
  @media ${device.mobileS} {
    padding: 0px;
  }
  
  @media ${device.mobileM} {
    padding: 0px;
  }

  @media ${device.mobileL} {
    padding: 1rem;
  }

`
export const HomeFooterDD = ({children}) => {
  return (
    <HomeFooterDDStyled>{children}</HomeFooterDDStyled>
  )
}
