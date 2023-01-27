import React from 'react'
import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const HomeFooterDDStyled = styled.footer`
    display: flex;
    justify-content: center;
    margin-bottom: 32px;

    @media ${device.mobileS} {
        padding: 0px;
    }

    @media ${device.mobileM} {
        padding: 0px;
    }

    @media ${device.mobileL} {
        padding: 1rem;
    }

    @media ${device.tablet} {
        display: none;
    }
`;
export const HomeFooterDD = ({children}) => {
  return (
    <HomeFooterDDStyled>{children}</HomeFooterDDStyled>
  )
}
