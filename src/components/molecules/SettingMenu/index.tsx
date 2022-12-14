import { useState } from 'react';
import { MenuItem } from '../../atoms';
import {
  StyledSettingMenu,
  StyleSettingValue,
  StyleSettingValueContainer,
  StyleTitle,
} from './styles';

export const SettingMenu = () => {
  return (
    <StyledSettingMenu>
      <StyleTitle>Slippage Tolerance</StyleTitle>
      <StyleSettingValueContainer>
        <StyleSettingValue>0.1%</StyleSettingValue>
        <StyleSettingValue>0.5%</StyleSettingValue>
        <StyleSettingValue customColor={true}>1.0%</StyleSettingValue>
        <StyleSettingValue>0.1%</StyleSettingValue>
      </StyleSettingValueContainer>
    </StyledSettingMenu>
  );
};
