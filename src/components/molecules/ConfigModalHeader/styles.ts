import styled from 'styled-components'

export const HeaderStyled = styled.header`
    width: 90%;
    margin-top:10px;
    padding: .5rem;
    border-radius: 10px;
    background-color: ${props => props.theme.StrongColor3};
    display: flex;
    gap:10px;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
`