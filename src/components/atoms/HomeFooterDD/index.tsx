import React from 'react'
import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const HomeFooterDDStyled = styled.footer`
    box-sizing: border-box;
    padding:1rem;
    place-self: center;
    display: flex;
    gap:2rem;
  
  @media ${device.mobileS} and ${device.mobileM}{
    padding: 10px;
  }

  @media ${device.mobileM} and ${device.mobileL} {
    padding: 1rem;
  }

`
export const HomeFooterDD = ({children}) => {
  return (
    <HomeFooterDDStyled>{children}</HomeFooterDDStyled>
  )
}
