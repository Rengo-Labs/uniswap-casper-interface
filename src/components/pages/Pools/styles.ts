import styled from 'styled-components'

export const WrappedPool = styled.div`
    display: grid; 
    grid-template-columns: repeat(11, 1fr)
`

export const WrappedPoolTitle = styled.div`
    grid-row: 2;
    grid-column: 1/11;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 0 10px 0;
`

export const TitleBox = styled.div`
    flex: 2.9; 
    padding: 10px 10px 10px 20px; 
    background-color: ${props => props.theme.secondBackgroundColor};
    margin-right: 1.5rem; 
    font-size: 1.2rem;
    height: 1.5rem; 
    display: flex; 
    align-items: center;
`
export const Column6 = styled.div`
    flex: 6;
`
export const Column1 = styled.div`
    flex: 1.2;
`