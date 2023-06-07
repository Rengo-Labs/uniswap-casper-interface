import styled from 'styled-components'

export const ButtonStyle = styled.button`
    width: 80%;
    color: ${props => props.theme.StrongColor};
    background-color: ${props => props.theme.TertiaryColor};
    padding:10px 0;
    border-radius: 10px;
    border:none;
    box-shadow: 0 0 1rem .2rem rgba(0,0,0,.3);
    &:hover{
        cursor: pointer;
        background-color: ${props => props.theme.TertiaryColor2};
    }
    &:active{
        background-color: ${props => props.theme.TertiaryColor3};
    }
    &:disabled{
        background-color: ${props => props.theme.TertiaryColor2};
    }
`
