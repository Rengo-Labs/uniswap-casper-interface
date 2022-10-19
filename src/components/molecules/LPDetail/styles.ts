import styled from 'styled-components'

export const CollapsingContainerStyled = styled.div`
    width: 366px;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid black;
    grid-template-rows: auto auto;
`
export const CollapsingHeader = styled.section`
    padding: 0;
    color: ${props => props.theme.secondBackgroundColor}
    cursor: pointer;
`
export const CollapsingBody = styled.div`
    padding: 6px;
`
export const CollapsingRow = styled.div`
    display: flex;
    padding-top: 12px;
    font-size: 14px;
`
export const CollapsingColumnLeft = styled.div`
    flex: 1;
    text-align: left;
`
export const CollapsingColumnRight = styled.div`
    flex: 1;
    text-align: right;
`