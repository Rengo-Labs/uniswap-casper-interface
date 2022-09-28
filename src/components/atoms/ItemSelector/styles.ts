import styled from "styled-components";

export const DropDownContainer = styled("div")`
  width: 10.5em;
  margin: 0 auto;
`

export const DropDownHeader = styled("div")`
  margin-bottom: 0.2em;
  padding: 0.4em 0.4em 0.4em 0.4em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  font-size: 1rem;
  color: white;
  background: rgb(120, 100, 244);
`

export const DropDownListContainer = styled("div")`
    position: absolute;
    width: 8.7vw;
`

export const DropDownList = styled("ul")`
  padding: 0.4em 0.4em 0 0.4em;
  margin: 0;
  background: rgb(120, 100, 244);
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
`