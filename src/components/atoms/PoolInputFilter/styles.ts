import styled from 'styled-components'

export const InputStyled = styled.input`
    box-sizing: border-box;
    background-color: transparent;
    color: ${props => props.theme.PrimaryColor};
    border-style:none;
    font-family: 'EpilogueLight'; 
    font-size: 0.8vw;
    width:100%;
    &::placeholder{
        color:rgba(255,255,255,.6);
        background-color: transparent;
    }
    &:focus{
        outline: none;
    }
`