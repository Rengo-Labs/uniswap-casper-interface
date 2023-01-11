import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const NavBarStyle = styled.nav`
  padding: 10px 40px;
  grid-column: 1/2;
  box-sizing: border-box;
  display: grid;
  grid-template: 1fr / repeat(3,1fr);
  place-content: center;

  & > *:nth-child(1) {
    display: grid;
    justifyItems: start;
    alignItems: center;
    padding: 1em;
  }

  & > *:nth-child(2) {
    display: grid;
    place-items: center
  }

  @media ${device.mobileS} {
    padding: 10px 5px;
    grid-template: 1fr / repeat(1,1fr) !important;

    & > *:nth-child(1) {
      display: none;
    }

    & > *:nth-child(3) {
      display: none;
    }
  }

  @media ${device.mobileM} {
    padding: 10px 10px;
  }

  @media ${device.mobileL} {
    padding: 10px 15px;
    grid-template: 1fr / repeat(1,1fr) !important;

    & > *:nth-child(1) {
      display: none;
    }

    & > *:nth-child(3) {
      display: none;
    }
  }

  @media ${device.tablet} {
    padding: 10px 40px;

    grid-template: 1fr / repeat(3,1fr) !important;

    & > *:nth-child(1) {
      display: grid;
    }

    & > *:nth-child(3) {
      display: flex;
    }
  }
`
