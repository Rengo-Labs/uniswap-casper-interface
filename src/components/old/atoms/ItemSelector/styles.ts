import styled from "styled-components";
import {device} from "../../../../contexts/ThemeContext/themes";

export const DropDownContainer = styled("div")`
    /*margin-right: 1vw;*/
    @media ${device.mobileS} {
        width: 100%;
    }
    
    @media ${device.tablet} {
        width: auto;
    }
`

export const DropDownHeader = styled("div")`
    display: flex;  
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
    }
    
    @media ${device.laptop} {
        
        /*height: 58px;*/
    }
`

export const DropDownListContainer = styled("div")`
    position: absolute;
    z-index: 2;
    
    @media ${device.mobileS} {
        width: auto;
    }
    
    @media ${device.tablet} {
        width: 11.625rem;
    }
`

export const DropDownList = styled("ul")`
  padding: 0.4em 0.4em 0 0.4em;
  margin: 0;
  background: ${props => props.theme.secondBackgroundColor};
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: white;
  
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
