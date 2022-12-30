import React from 'react';
import styled from 'styled-components';
const NewBalanceSpace = styled.section`
  justify-self: end;
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 32px;
  text-align: right;
  letter-spacing: 0.02em;
  color: ${(props) => props.theme.NewGrayColor};
`;
export const NewBalanceSpaceNSM = ({ children }) => {
  return <NewBalanceSpace>{children}</NewBalanceSpace>;
};
