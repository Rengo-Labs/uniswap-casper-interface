import styled from 'styled-components'

export const InputStyled = styled.input`
    background-color: ${props => props.theme.StrongColor3};
    border-style:none;
    &::placeholder{
        color:rgba(255,255,255,.6);
        background-color: ${props => props.theme.StrongColor3};
    }
`