import styled from 'styled-components'

interface CardStyledInterface { 
    width?: string;
    gridColumn?: string;
    gridRow?: string;
}

export const CardStyled = styled.section<CardStyledInterface>`
    grid-row: ${props => props.gridRow};
    grid-column: ${props => props.gridColumn};
    width: ${props => props.width};
    margin: .5em auto;
    border: 0.5px solid black;
    border-radius: 20px;
    background-color: ${props => props.theme.mainBackgroundColor};
    display: grid;
    grid-template-rows: auto 1fr;
`
export const CardHeaderStyled = styled.section`
    padding:1rem ;
    display: flex;
    justify-content: space-between;
`

export const CardTitleStyled = styled.div`
    color: ${props => props.theme.secondBackgroundColor};
    font-size: 1.2em;
    padding-left: 5%;
`