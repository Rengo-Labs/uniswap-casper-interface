import React from 'react';
import styled from 'styled-components';
const ButtonHalfMaxStyle = styled.div<any>`
  background-color: ${(props) => props.theme.NewPurpleColor};
  color: white;
  padding: 0px 5px;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.02em;
`;

export const ButtonHalfMax = ({ children, onClick }) => {
  return <ButtonHalfMaxStyle onClick={onClick}>{children}</ButtonHalfMaxStyle>;
};
