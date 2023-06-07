import React from 'react'
import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";

const ConnectButtonContainerStyled = styled.nav`
  position: absolute;
  display: block;
  right: 0;
  min-width: 160px;

  & button {
    width: 100%;
  }

  @media ${device.mobileS} {
    min-width: 60px;
    top: 40px;
  }
  @media ${device.mobileL} {
    min-width: 60px;
    top: 40px;
  }
  @media ${device.tablet} {
    min-width: auto;
    top: 0;
  }
`
export const ConnectButtonContainerCC = ({children}) => {
    return (
        <ConnectButtonContainerStyled>{children}</ConnectButtonContainerStyled>
    )
}
