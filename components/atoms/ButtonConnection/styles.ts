import styled from "styled-components";

export const ButtonStyle = styled.button<any>`
    color: ${props => props.theme.StrongColor};
    background-color: ${props => props.theme.TertiaryColor};
    padding:10px;
    width: 100%;
    border-radius: 10px;
    border:none;
    box-shadow: 0 0 1rem .2rem rgba(0,0,0,.3);
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow: ellipsis;
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.TertiaryColor2};
    }

    ${props => props.isSelected && `
    color: red;
    background: white;
    `}
`