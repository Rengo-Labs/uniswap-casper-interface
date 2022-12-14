import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const ButtonStyle = styled.button<any>`
    color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGrayColor};
    background-color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGreyColor};
    padding: 1.7vh 1.7em;
    border:none;
    width: 8vw;
    height: 5.6vh;
    font-family: 'EpilogueLight';
    font-size: .8rem;
    display: grid;
    place-items: center;
    &:hover{
        cursor: pointer;
    }
    &:active{
        color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGrayColor};
        background-color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGreyColor};
    }

    @media ${device.mobileS} {
      width: auto;
    }
    @media ${device.mobileM} {
      width: auto;
    }
    @media ${device.mobileL} {
      width: auto;
    }
    @media ${device.tablet} and ${device.laptop} and ${device.laptopL} {
      width: 8vw;
    }
`
