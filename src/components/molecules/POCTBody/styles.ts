import styled from 'styled-components'

export const TBody = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    color: black;
    font-family: 'MyriadPro';
    gap: 8px;
`

export const TColumn6 = styled.div`
    flex: 6;
`

export const TBodyColumn6 = styled.div`
    flex: 6;
    padding: 0.3rem 0 0;
`

export const TColumn3 = styled.div`
    flex: 3;
`

export const TColumn1 = styled.div`
    flex: 1;
`

export const TButtonColumn3 = styled.div`
  flex: 3;
  padding: 0.25rem 0 0;
`

export const TBodyColumn3 = styled.div`
  flex: 3;
  padding: 0.3rem 0 0;
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