import styled from 'styled-components'

export const PillowButtonStyled = styled.button`
    box-sizing: border-box;
    border-style:none;
    background-color: ${prop => prop.theme.StrongColor2};
    color: ${prop => prop.theme.PrimaryColor};
    padding:.3rem .5rem;
    &:hover{
        background-color: ${prop => prop.theme.PrimaryColor};
        color: ${prop => prop.theme.StrongColor2};
        border-radius: 3rem;
    }
` 