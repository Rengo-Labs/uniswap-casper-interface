import styled from 'styled-components'

export const SlippageContainer = styled.section`
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    padding-top: 10px;
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
    color: white;
    width: 25%;
    border: solid 1px;
`
export const Span = styled.span`
    position: absolute;
    right: 10px;
    top: 10px;
`