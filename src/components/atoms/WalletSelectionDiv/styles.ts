import styled from "styled-components";

export const WalletSelectionStyled = styled.div<any>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .3rem .5rem;
    gap: 10px;
    background-color: ${props => props.theme.StrongColor5};
    border-radius: 10px;
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

export const WalletSelectionImageStyled = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`