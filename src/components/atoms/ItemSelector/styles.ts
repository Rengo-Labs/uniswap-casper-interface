import styled from "styled-components";

export const DropDownContainer = styled("div")`
  width: 10.5em;
  margin: 0 auto;
`

export const DropDownHeader = styled("div")`
  margin-bottom: 0.2em;
  border-radius: 8px;
  padding: 0.6em;
  width: 88%;
  box-shadow: 0 2px 3px ${props => props.theme.secondBackgroundColor};
  font-weight: 500;
  font-size: 1rem;
  color: white;
  background: ${props => props.theme.secondBackgroundColor};
`

export const DropDownListContainer = styled("div")`
    position: absolute;
    width: 8.7vw;
`

export const DropDownList = styled("ul")`
  padding: 0.4em 0.4em 0 0.4em;
  margin: 0;
  background: ${props => props.theme.secondBackgroundColor};
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: white;
  font-size: 1rem;
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