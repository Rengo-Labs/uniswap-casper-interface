import styled from 'styled-components'

export const CardStyled = styled.section`
    width: 26%;
    height: 60%;
    margin: 3rem auto;
    border-radius: 20px;
    display: grid;
    grid-template: auto 1fr / 1fr;
    background-color: ${props => props.theme.StrongColor3};
`
export const CardHeaderStyled = styled.section`
    margin: .8rem auto;
    width: 80%;
    display: flex;
    justify-content: space-between;
`
