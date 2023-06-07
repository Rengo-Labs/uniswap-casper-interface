import styled from 'styled-components'

export const ButtonStyle = styled.button<any>`
    color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGrayColor};
    background-color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGreyColor};
    padding: 1.7vh 1.7em;
    border-radius: 10px;
    border:none;
    width: 8vw;
    height: 5.6vh;
    font-family: 'MyriadProLight';
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
