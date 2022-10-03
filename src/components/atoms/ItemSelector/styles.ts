import styled from "styled-components";

export const DropDownContainer = styled("div")`
    margin-right: 1vw;
`

export const DropDownHeader = styled("div")`
    border-radius: 8px;
    width: 8vw;
    font-weight: 500;
    font-size: 0.8vw;
    color: white;
    background: ${props => props.theme.secondBackgroundColor};
`

export const DropDownListContainer = styled("div")`
    position: absolute;
    width: 8.5vw;
`

export const DropDownList = styled("ul")`
  padding: 0.4em 0.4em 0 0.4em;
  margin: 0;
  background: ${props => props.theme.secondBackgroundColor};
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: white;
  font-size: 0.8vw;
  font-weight: 500;
  &:first-child {
    padding-top: 0.8em;
  }
`

export const ListItem = styled("li")`
  list-style: none;
  margin-bottom: 0.8em;
  font-family: 'EpilogueLight';
  font-size: 1em;
`