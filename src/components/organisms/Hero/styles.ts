import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const HeroStyles = styled.section`
    place-self: center;
    display: grid;
    grid-template:1fr 1fr / auto;
    place-items:center;

  @media ${device.mobileS}{
    grid-template: 0.5fr 0.5fr / auto;
  }

  @media ${device.tablet} {
    grid-template:1fr 1fr / auto;
  }
`


