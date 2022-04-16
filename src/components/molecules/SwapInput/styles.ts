import styled from 'styled-components'

export const SwapInputStyled = styled.section`
    width: 100%;
    padding: 2rem 1rem;
    border-radius: 10px;
    background-color: ${props => props.theme.StrongColor3};
    display: flex;
    justify-content: space-around;
    align-items: start;
`

export const InputContainerStyled = styled.aside`
    display: flex;
    flex-direction: column;
    gap:10px;
`
export const SelectStyled = styled.select`
    background-color: ${props => props.theme.StrongColor3};
    color: ${props => props.theme.PrimaryColor};
    border:none;
`

export const InputStyled = styled.input`
    background-color: ${props => props.theme.StrongColor3};
    color: ${props => props.theme.PrimaryColor};
    box-shadow: none;
    border-style:none;
    &::placeholder{
        color: white;
    }
`