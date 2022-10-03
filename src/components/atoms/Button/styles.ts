import styled from 'styled-components'

export const ButtonStyle = styled.button`
    color: ${props => props.theme.secondBackgroundColor};
    background-color: ${props => props.theme.thirdBackgroundColor};
    padding: 0.1em 1.7em;
    border-radius: 10px;
    border:none;
    width: 8vw;
    height: 5vh;
    font-family: 'EpilogueLight';
    font-size: .8vw;
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
