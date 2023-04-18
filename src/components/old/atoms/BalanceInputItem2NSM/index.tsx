import React from 'react';
import styled from 'styled-components';
const BalanceInputItem2Styled = styled.div`
  align-self: center;
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.02em;
  color: #545454;
`;
export const BalanceInputItem2NSM = ({ children }) => {
  return <BalanceInputItem2Styled>{children}</BalanceInputItem2Styled>;
};
