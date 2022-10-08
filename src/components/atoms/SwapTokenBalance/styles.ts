import styled from "styled-components";
import { DebounceInput } from "react-debounce-input";

export const SwapTokenBalanceStyled = styled.aside`
  box-sizing: border-box;
  border-radius: 10px;
  background-color: ${(props) => props.theme.StrongColor2};
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 0.5rem;
`;
export const RoundedButtonStyled = styled.button`
  box-sizing: border-box;
  border-radius: 2rem;
  width: 30%;
  margin-left: auto;
  border-style: outset;
  color: #fff;
  border: 1px solid ${(props) => props.theme.TertiaryColor};
  background-color: ${(props) => props.theme.StrongColor2};
  cursor: pointer;
  &:hover {
    color: #000;
    background-color: ${(props) => props.theme.TertiaryColor};
  }
  &:active {
    background-color: ${(props) => props.theme.TertiaryColor2};
    border: 1px inset ${(props) => props.theme.TertiaryColor2};
  }
`;
export const InputStyled = styled(DebounceInput)`
  width: 100%;
  color: ${(props) => props.theme.PrimaryColor};
  text-align: right;
  background-color: ${(props) => props.theme.StrongColor2};
  border-style: none;
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.theme.PrimaryColor2};
  }
`;

export const ButtonContainerStyled = styled.div`
  text-align: right;
`;
