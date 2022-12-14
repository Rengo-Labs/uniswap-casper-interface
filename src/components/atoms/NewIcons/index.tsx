import React from 'react'
import {IconContainerStyle} from "./styles";
import styled from 'styled-components';
import {device} from "../../../contexts/ThemeContext/themes";

const IconStyled = ({Icon, size, style = {}}) => {
    const IconStyled = styled(Icon)`
      width: ${size}px;
      height: ${size}px;
      
      @media ${device.mobileS} {
        width: 32px;
        height: 32px;
      }

      @media ${device.mobileM} {
        width: 32px;
        height: 32px;
      }

      @media ${device.tablet} {
        width: ${size}px;
        height: ${size}px;
      }
    `;
    return (
        <IconContainerStyle size={size} style={style}>
            <IconStyled/>
        </IconContainerStyle>
    );
}

export const NewIcons = ({Icon, size, style = {}}) => (
    <IconStyled Icon={Icon} size={size} style={style}/>
)
