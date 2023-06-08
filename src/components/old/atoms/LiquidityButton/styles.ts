import styled from 'styled-components';
import {device} from "../../../../contexts/ThemeContext/themes";

export const LiquidityButtonStyle = styled.button<any>`
  color: ${(props) =>
    props.enabled
      ? props.theme.secondBackgroundColor
      : props.theme.NewGrayColor};
  background-color: ${(props) =>
    props.enabled
      ? props.theme.thirdBackgroundColor
      : props.theme.NewGreyColor};
  padding: .7rem 1.2rem;
  border-radius: 10px;
  border: none;
  font-family: 'MyriadPro';
  font-size: 16px;
  display: grid;
  place-items: center;
  &:hover {
    cursor: pointer;
  }
  &:active {
    color: ${(props) =>
      props.enabled
        ? props.theme.thirdBackgroundColor
        : props.theme.NewGrayColor};
    background-color: ${(props) =>
      props.enabled
        ? props.theme.secondBackgroundColor
        : props.theme.NewGreyColor};
  }

  @media ${device.desktop} {
    width: 8vw;
    height: 4.6vh;
  }
`;
