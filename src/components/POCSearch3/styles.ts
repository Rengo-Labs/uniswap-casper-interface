import styled from 'styled-components'
import {device} from "../../contexts/ThemeContext/themes";


export const PoolSeachButtonStyled = styled.section`
    flex: 0.8;
    height: 58px;
    box-sizing: border-box;
    background-color: white;
    
    padding:.55em 1em;
    border-radius: 10px;
    border: 1px solid black;
    display: flex;
    align-items: center;
    gap:.5rem;

  &::hover {
    border: 1px solid ${props => props.theme.secondBackgroundColor};
  }
  &:placeholder {
    border: 1px solid ${props => props.theme.secondBackgroundColor};
  }
  
  @media ${device.mobileS} {
      display: flex;
      width: 100%;
  }
  
  @media ${device.laptop} {
      display: none;
  }
`