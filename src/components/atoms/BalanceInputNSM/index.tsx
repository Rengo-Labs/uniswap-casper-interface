import React from 'react';
import styled from 'styled-components';
export const BalanceInput = styled.input`
  all: unset;
  width: 100%;
  height: 100%;
  text-align: right;
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 30px;
  font-size: 22px;
  &:active {
    border: none;
  }
`;
export const BalanceInputNSM = ({ min, onChange, value, name, id, type }) => {
  return (
    <BalanceInput
      min={min}
      onChange={onChange}
      type={type}
      name={name}
      id={id}
      value={value}
    />
  );
};
