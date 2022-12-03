import styled from 'styled-components'

export const LiquidityButtonStyle = styled.button<any>`
    color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGrayColor};
    background-color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGreyColor};
    padding: 1.7vh 1.7em;
    border-radius: 10px;
    border:none;
    width: 8vw;
    height: 4.6vh;
    font-family: 'EpilogueLight';
    font-size: .8vw;
    display: grid;
    place-items: center;
    &:hover{
        cursor: pointer;
    }
    &:active{
        color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGrayColor};
        background-color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGreyColor};
    }
`
