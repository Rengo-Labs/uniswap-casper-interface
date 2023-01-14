import styled from "styled-components";

export const DropDownContainer = styled("div")`
    /*margin-right: 1vw;*/
`

export const DropDownHeader = styled("div")`
    display: flex;  
    align-items: center;
    padding-Left: 0.4rem;
    border-radius: 8px;
    width: 11.625rem;
    height: 58px;
    color: white;
    
    font-size: 18px; 
    line-height: 26px;
  
    letter-spacing: 0.02em;
    font-family: 'MyriadProLight';
    background: ${props => props.theme.secondBackgroundColor};
    &:hover{
        cursor: pointer;
    }
`

export const DropDownListContainer = styled("div")`
    position: absolute;
    width: 11.625rem;
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