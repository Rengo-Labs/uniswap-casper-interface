import styled from 'styled-components'
import {device} from "../../../../contexts/ThemeContext/themes";
export const HeroStyles = styled.section`
    place-self: center;
    display: grid;
    grid-template:1fr 1fr / auto;
    place-items:center;

  @media ${device.mobileS}{
    grid-template: 0.5fr 0.5fr / auto;
  }

  @media ${device.mobileM}{
    grid-template: 0.9fr 0.9fr / auto;
  }

  @media ${device.mobileL}{
    grid-template: 0.9fr 0.9fr / auto;
  }

  @media ${device.tablet} {
    grid-template:1fr 1fr / auto;
  }
`


