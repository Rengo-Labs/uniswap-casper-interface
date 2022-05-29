import styled from 'styled-components'

export const InputStyled = styled.input`
    box-sizing: border-box;
    background-color: ${props => props.theme.StrongColor3};
    color: ${props => props.theme.PrimaryColor};
    border-style:none;
    width:100%;
    &::placeholder{
        color:rgba(255,255,255,.6);
        background-color: ${props => props.theme.StrongColor3};
    }
    &:focus{
        outline: none;
    }
`