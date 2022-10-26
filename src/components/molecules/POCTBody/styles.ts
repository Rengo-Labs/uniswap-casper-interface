import styled from 'styled-components'

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
    border-radius: 7px;
    border: 1px solid black;
    padding: 7px 0px 7px 0px;
    margin: 2px 0 2px 0;
    background-color: white;
`

export const WrappedRow = styled.div`
    display: flex;
    width: 100%;
`

export const TRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px 0px 3px 0px;
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
    display: flex;
`

export const CircleButton = styled.button`
    background-color: ${props => props.disabled ? "grey" : props.theme.secondBackgroundColor};
    display: flex;
    padding: 0;
    border: 0;
    cursor: ${props => props.disabled ? "auto" : "pointer"};
    justify-content: center;
    border-radius: 45%;
    margin: 5px;
    height: 4.5vh;
    width: 4.5vh;
`