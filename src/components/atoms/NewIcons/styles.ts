import styled from 'styled-components';
import { device } from '../../../contexts/ThemeContext/themes';

export const IconContainerStyle = styled.div.attrs(
  (props: { size: any; width?: number; height?: number }) => props
)`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  height: ${(props) => props.height || props.size}px;
  width: ${(props) => props.width || props.size}px;

  @media ${device.mobileS} {
    width: ${(props) => props.height || props.size}px;
    height: ${(props) => props.width || props.size}px;
  }

  @media ${device.mobileM} {
    width: ${props => props.size <= 20 ? props.size : 25}px;
    height: ${props => props.size <= 20 ? props.size : 25}px;;
  }
  
  @media ${device.mobileL} {
    width: ${props => props.size <= 20 ? props.size : 32}px;
    height: ${props => props.size <= 20 ? props.size : 32}px;;
  }

  @media ${device.tablet} {
    height: ${(props) => props.height || props.size}px;
    width: ${(props) => props.width || props.size}px;
  }

  & > * {
    height: ${(props) => props.height || props.size | 20}px;
    width: ${(props) => props.width || props.size || 20}px;

    @media ${device.mobileS} {
      width: width;
      height: height;
    }

    @media ${device.mobileM} {
      width: width;
      height: height;
    }

    @media ${device.tablet} {
      width:  ${(props) => props.width || props.size}px;
      height: ${(props) => props.height || props.size}px;
    }
  }
`;
