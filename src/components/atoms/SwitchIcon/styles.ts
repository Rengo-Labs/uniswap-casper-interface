import styled from 'styled-components'

export const SwitchButton = styled.button`
    background-color: ${prop => prop.theme.StrongColor3};
    color: white;
    border-radius: 50%;
    border-style: none;
    cursor:pointer;
    width: 3rem;
    height: 3rem;
    display: grid;
    place-items: center;
    transition: transform 1s;
    &:active {
        border-style:inset;
    }
    &:hover{
        transform: rotate(180deg);
    }
` 