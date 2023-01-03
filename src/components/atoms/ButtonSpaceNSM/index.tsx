import React from 'react';
import styled from 'styled-components';
export const ButtonSpaceStyled = styled.div`
  justify-self: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  letter-spacing: 0.02em;
`;
export const ButtonSpaceNSM = ({ children }) => {
  return <ButtonSpaceStyled>{children}</ButtonSpaceStyled>;
};
