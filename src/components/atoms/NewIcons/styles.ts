import styled from "styled-components";
import {device} from "../../../contexts/ThemeContext/themes";

export const IconContainerStyle = styled.div.attrs((props: { size: number }) => props)`
  display: flex;
  alignItems: 'center';
  alignSelf: 'center';
  justifyContent: 'center';
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  
  @media ${device.mobileS} {
    width: 32px;
    height: 32px;
  }

  @media ${device.mobileM} {
    width: ${props => props.size <= 20 ? props.size : 32}px;
    height: ${props => props.size <= 20 ? props.size : 32}px;;
  }

  @media ${device.tablet} {
    width: ${props => props.size}px;
    height: ${props => props.size}px;
  }
`