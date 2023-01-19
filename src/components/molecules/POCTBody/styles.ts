import styled from 'styled-components'

export const TBody = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    color: black;
    font-family: 'MyriadPro';
    gap: 8px;
`

export const CircleButton = styled.button`
    background-color: ${props => props.disabled ? "grey" : props.theme.secondBackgroundColor};
    display: flex;
    padding: 0;
    border: 0;
    cursor: ${props => props.disabled ? "auto" : "pointer"};
    justify-content: center;
    border-radius: 45%;
    margin: 5px;
    height: 4.5vh;
    width: 4.5vh;
`