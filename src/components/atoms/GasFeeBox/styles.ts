import styled from 'styled-components'

export const SlippageContainer = styled.section`
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
`
export const SlippageColumnLeft = styled.section`
    width: 50%;
    text-align: start;
`
export const SlippageColumnRight = styled.section`
    width: 50%;
    text-align: end;
`
export const Input = styled.input`
    background: transparent;
    color: black;
    width: 35%;
    border: solid .5px black;
`
export const Span = styled.span`
    position: absolute;
    right: 0.5vw;
    top: 3px;
`