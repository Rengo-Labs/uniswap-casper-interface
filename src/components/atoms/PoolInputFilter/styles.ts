import styled from 'styled-components'

export const InputStyled = styled.input`
    box-sizing: border-box;
    background-color: transparent;
    /*color: ${props => props.theme.PrimaryColor};*/
    color: black;
    border-style:none;
    font-family: 'EpilogueLight'; 
    font-size: 16px;
    line-height: 32px;
    width:100%;
    &::placeholder{
        color: #545454;
        background-color: transparent;
    }
    &:focus{
        outline: none;
    }
`