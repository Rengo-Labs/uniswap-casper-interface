import styled from "styled-components";

export const WalletSelectionStyled = styled.div<any>`
    margin-left: 0.5vw;
    margin-right: 0.5vw;
    display: flex;
    align-items: center;
    padding: .3rem .5rem;
    gap: 10px;
    background-color: ${props => props.theme.StrongColor5};
    border-radius: 10px;
    width: 258px;
    height: 42px;
    &:hover{
        cursor: pointer;
    }
    &:active{
        background-color: ${props => props.theme.StrongColor3};
    }
    
    ${props => props.isSelected && `
    color: red;
    background: white;
    `}
`