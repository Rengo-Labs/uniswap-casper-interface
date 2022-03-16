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
    &:active {
        border-style:inset;
    }
` 