import styled from "styled-components";


export const ButtonStyleMobile = styled.div<any>`
    position: absolute;
    top: 25%;
    right: 2rem;
    align-items: center;
    color: ${props => props.theme.secondBackgroundColor};
    background: ${props => props.theme.thirdBackgroundColor};
    width: 36px;
    height: 36px;
    border:none;
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow: ellipsis;
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.secondBackgroundColor};
        color: ${props => props.theme.thirdBackgroundColor};
    }
`
