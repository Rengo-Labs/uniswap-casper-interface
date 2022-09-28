import styled from "styled-components";

export const ButtonStyle = styled.button<any>`
    color: rgb(120, 100, 244);
    background-color: #70ecd4;
    padding:10px;
    width: 80%;
    border-radius: 10px;
    border:none;
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