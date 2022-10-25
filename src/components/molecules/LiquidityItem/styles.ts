import styled from 'styled-components'

export const CollapsingRow = styled.div`
    display: flex;
    padding-top: 10px;
`

export const TBody = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 50vh;
    color: black;
    font-family: 'EpilogueLight'; 
    font-size: 1em;
`

export const TWrapRow = styled.div`
    background-color: white;
    border-radius: 20px;
    border: 1px solid black;
    padding: 7px 0px 7px 0px;
    margin: 2px 0 2px 0;
    width: 462px;
`

export const WrappedRow = styled.div`
    display: flex;
    padding-top: 10px;
    padding-left: 35px;
    padding-right: 35px;
`

export const TRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const TColumn6 = styled.div`
    flex: 6;
`

export const TColumn3 = styled.div`
    flex: 3;
`

export const TColumn1 = styled.div`
    flex: 1;
`

export const TBodyExpanded = styled.div`
    
`

export const CircleButton = styled.button`
    background-color: ${props => props.theme.secondBackgroundColor};
    display: flex;
    padding: 0;
    border: 0;
    cursor: pointer;
    justify-content: center;
    border-radius: 45%;
    margin: 5px;
    height: 4.5vh;
    width: 4.5vh;
`