import React from 'react'
import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";

const HeroTitle = styled.h1`
    font-family: MyriadPro;
    font-size: 55px;
    line-height: 71px;
    padding: 15px 0;

    @media ${device.mobileS} {
        font-size: 20px;
        line-height: 28px;
        letter-spacing: 0.05em;
        text-align: center;
        padding: 0 5px 0 5px;
    }

    @media ${device.mobileM} {
        font-size: 22px;
    }

    @media ${device.mobileL} {
        font-size: 22px;
    }

    @media ${device.tablet} {
        font-size: 55px;
        line-height: 71px;
        padding: 15px 0;
    }
`;
export const HeroTitleDD = ({children}) => {
  return (
    <HeroTitle>{children}</HeroTitle>
  )
}
