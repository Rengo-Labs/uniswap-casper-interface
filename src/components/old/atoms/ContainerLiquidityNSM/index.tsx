import React from 'react';
import styled from 'styled-components';
import {device} from "../../../../contexts/ThemeContext/themes";

const ContainerLiquidityStyles = styled.main`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  gap: 10px;
  padding: 10px;
  color: black;
  display: grid;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${device.laptop} {
    display: grid;
    grid-template-columns: auto auto;
    align-items: flex-start;
  }
`;
export const ContainerLiquidityNSM = ({ children }) => {
  return <ContainerLiquidityStyles>{children}</ContainerLiquidityStyles>;
};
