import styled from 'styled-components'

export const WrappedPool = styled.div`
    display: grid; 
    grid-template-columns: repeat(11, 1fr)
`

export const WrappedPoolTitle = styled.div`
    grid-row: 2;
    grid-column: 1/11;
    display: grid; 
    grid-template-columns: repeat(13, 1fr);
    align-items: center;
    margin: 0 0 10px 0;
`
