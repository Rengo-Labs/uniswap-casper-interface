import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const ButtonStyle = styled.button<any>`
    color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGrayColor};
    background-color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGreyColor};
    padding: 1.7vh 1.7em;
    border:none;
    width: 233.5px;
    height: 64px;
    font-family: 'EpilogueLight';
    font-size: .8rem;
    display: grid;
    place-items: center;
    border-radius: 8px;

  &:hover{
        cursor: pointer;
    }
    &:active{
        color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGrayColor};
        background-color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGreyColor};
    }

    @media ${device.mobileS} {
      width: 220px;
    }
  
    @media ${device.tablet} {
      width: 233.5px;
      height: 64px;
    }
    @media ${device.laptop} {
      width: 233.5px;
      height: 64px;
    }
`
