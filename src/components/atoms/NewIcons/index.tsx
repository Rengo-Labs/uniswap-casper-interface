import React from 'react'
import {IconContainerStyle} from "./styles";
import styled from 'styled-components';
import {device} from "../../../contexts/ThemeContext/themes";

const IconStyled = styled.div<any>`
  & > * {
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    
    @media ${device.mobileS} {
      width: 32px;
      height: 32px;
    }

    @media ${device.mobileM} {
      width: 32px;
      height: 32px;
    }

    @media ${device.tablet} {
      width: ${props => props.size}px;
      height: ${props => props.size}px;
    }
  }
`

const IconStyled2 = ({Icon, size, style = {}}) => {   
    return (
        <IconContainerStyle size={size} style={style}>
            <IconStyled size={size}>
              <Icon/>
            </IconStyled>
        </IconContainerStyle>
    );
}

export const NewIcons = ({Icon, size, style = {}}) => (
    <IconStyled2 Icon={Icon} size={size} style={style}/>
)
