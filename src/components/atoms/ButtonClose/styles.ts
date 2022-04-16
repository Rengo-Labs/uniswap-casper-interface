import styled from "styled-components";

export const ButtonCloseStyle = styled.button`
    color: ${props => props.theme.StrongColor};
    background-color: ${props => props.theme.TertiaryColor};
    border-radius: 10px;
    border:none;
    padding:8px;
    font-size: 1.5rem;
    box-shadow: 0 0 1rem .2rem rgba(0,0,0,.3);
    display: grid;
    place-items: center;
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.TertiaryColor2};
    }
`