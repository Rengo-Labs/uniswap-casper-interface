import styled from 'styled-components'

export const CardStyled = styled.section`
    width: ${props => props.width};
    margin: .5em auto;
    border-radius: 20px;
    background-color: ${props => props.theme.StrongColor3};
    display: grid;
    grid-template-rows: auto 1fr;
`
export const CardHeaderStyled = styled.section`
    padding:1rem ;
    display: flex;
    justify-content: space-between;
`
