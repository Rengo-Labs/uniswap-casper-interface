import styled from 'styled-components'

export const TokenButtonStyled = styled.button`
    border-style: none;
    color: white;
    background-color: ${props => props.theme.StrongColor3};
    display: flex;
    justify-content:center;
    gap: 1em;
    cursor:pointer;
`