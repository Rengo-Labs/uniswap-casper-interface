import styled from 'styled-components'
import {device} from "../../contexts/ThemeContext/themes";
import { AiOutlineSearch } from "react-icons/ai";

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

export const IconStyled = styled(AiOutlineSearch) `
  background-color: #D9D9D9; 
  color: #999999; 
  border-radius: 50%; 
  padding: 0.2em; 
  height: 1em; 
  width: 1em;
`