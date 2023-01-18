import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const NavBarFooterStyle = styled.nav`
  padding: 10px 40px;
  grid-column: 1/2;
  box-sizing: border-box;
  display: grid;
  grid-template: 1fr / repeat(1,1fr);
  place-content: center;

  & > *:nth-child(1) {
    display: grid;
    place-items: center;
    padding-bottom: 1.0em;
  }

  & > *:nth-child(2) {
    gap: 1.0em;
  }
  
  @media ${device.tablet} {
    display: none;
  }
`
