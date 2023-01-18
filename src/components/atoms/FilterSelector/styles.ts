import styled from "styled-components";
import {device} from "../../../contexts/ThemeContext/themes";

export const DropDownContainer = styled("div")`
    /*margin-right: 1vw;*/
    width: 100%;
    
    @media ${device.laptop} {
        display: none;
    }
`

export const DropDownHeader = styled("div")`
    align-items: center;
    padding: 1rem 1.563rem;
    border-radius: 8px;
    color: white;
    gap: 4px;
    font-size: 18px; 
    line-height: 26px;
  
    letter-spacing: 0.02em;
    font-family: 'MyriadProLight';
    background: ${props => props.theme.secondBackgroundColor};
    &:hover{
        cursor: pointer;
    }
    
    @media ${device.mobileS} {
        width: auto;
        display: flex;  
    }
    
    @media ${device.laptop} {
        display: none;
    }
`

export const DropDownListContainer = styled("div")`
    position: absolute;
    z-index: 2;
    margin-top: 8px;
    
    @media ${device.mobileS} {
        width: 11.625rem;
    }
    
    @media ${device.laptop} {
        /*width: 11.625rem;*/
    }
`

export const DropDownList = styled("ul")`
  padding: 1rem;
  margin: 0;
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: black;
  border: 1px solid black;
  background-color: white;
  border-radius: 16px;
  
  &:hover{
        cursor: pointer;
  }
  &:first-child {
    padding-top: 0.8em;
  }
`

export const ListItem = styled("li")`
  list-style: none;
  margin-bottom: 0.8em;
  font-size: 18px; 
  line-height: 26px;
  
  letter-spacing: 0.02em;
  font-family: 'MyriadProLight';
  
  text-align: center;
`