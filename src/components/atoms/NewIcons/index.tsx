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
  return (
    <IconContainerStyle size={size} style={style} width={width} height={height}>
      <Icon/>
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
