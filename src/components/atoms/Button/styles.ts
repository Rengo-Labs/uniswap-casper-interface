import styled from 'styled-components'

export const ButtonStyle = styled.button`
    color: rgb(120,100,244);
    background-color: #70ecd4;
    padding: 0.6em 1.7em 0.6em 1.7em;
    border:none;
    display: grid;
    place-items: center;
    &:hover{
        cursor: pointer;
    }
    &:active{
        color: #70ecd4;
        background-color: rgb(120,100,244);
    }
`
