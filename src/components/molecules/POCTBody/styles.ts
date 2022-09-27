import styled from 'styled-components'

export const TBodyStyled = styled.tbody`
    box-sizing: border-box;
    padding: .5rem;
`

export const TBody = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 50vh;
`

export const TWrapRow = styled.div`
    flex: 1;
    border-radius: 7px;
    border: 1px solid black;
    padding: 7px 0px 7px 0px;
    margin: 2px 0 2px 0;
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
    background-color: #7864f4;
    display: flex;
    padding: 0;
    border: 0;
    justify-content: center;
    border-radius: 45%;
    margin: 5px;
    height: 4.5vh;
    width: 4.5vh;
`