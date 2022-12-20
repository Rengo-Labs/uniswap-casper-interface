import React from 'react';
import { IconContainerStyle } from './styles';
import styled from 'styled-components';
import { device } from '../../../contexts/ThemeContext/themes';

interface IIconStyledProps {
  Icon: any;
  size?: any;
  width?: number;
  height?: number;
  style?: any;
}

const IconStyled = ({ Icon, size, width, height, style = {} }: IIconStyledProps) => {
  const IconStyled = styled(Icon)`
    height: ${height || size}px;
    width: ${width || size}px;

    @media ${device.mobileS} {
      width: 32px;
      height: 32px;
    }

    @media ${device.mobileM} {
      width: 32px;
      height: 32px;
    }

    @media ${device.tablet} {
      width:  ${width || size}px;
      height: ${height || size}px;
    }
  `;
  return (
    <IconContainerStyle size={size} style={style} width={width} height={height}>
      <IconStyled />
    </IconContainerStyle>
  );
};

export const NewIcons = ({ Icon, size, width, height, style = {} }: IIconStyledProps) => (
  <IconStyled
    Icon={Icon}
    size={size}
    width={width}
    height={height}
    style={style}
  />
);
