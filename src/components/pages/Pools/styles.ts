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
    margin: 10vh 0 10px 0;
`