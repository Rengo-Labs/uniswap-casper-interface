import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

interface CardStyledInterface {
    width?: string;
    gridColumn?: string;
    gridRow?: string;
}

export const CardStyled = styled.section<CardStyledInterface>`
    grid-row: ${props => props.gridRow};
    grid-column: ${props => props.gridColumn};
    width: ${props => props.width};
    margin: .5em auto 4vh auto;
    border: 2px solid black;
    border-radius: 20px;
    background-color: ${props => props.theme.mainBackgroundColor};
    display: grid;
    grid-template-rows: auto 1fr;

  @media ${device.mobileS} {
    width: 100%;
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    grid-template-rows: auto 1fr;
  }

  @media ${device.mobileL} {
    width: 100%;
    grid-column: 2/11;
  }
  
  @media ${device.tablet} {
    width: ${props => props.width};
    grid-column: ${props => props.gridColumn};
  }
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
