import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const NavBarStyle = styled.nav`
  padding: 10px 40px;
  grid-column: 1/2;
  box-sizing: border-box;
  display: grid;
  grid-template: 1fr / repeat(3,1fr);
  place-content: center;

  @media ${device.mobileS} {
    padding: 10px 10px;
  }
  
  @media ${device.mobileM} {
    padding: 10px 15px;
  }
  
  @media ${device.mobileL} {
    padding: 10px 25px;
  }
  
  @media ${device.tablet} {
    padding: 10px 40px;
  }
`
