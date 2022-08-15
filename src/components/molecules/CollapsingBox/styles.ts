import styled from 'styled-components'

export const CollapsingContainerStyled = styled.section`
    background-color: ${props => props.theme.StrongColor3};
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    display: grid;
    grid-template-rows: auto auto;
`
export const CollapsingHeader = styled.section`
    padding: 6px;
    cursor: pointer;
`
export const CollapsingBody = styled.section`
    padding: 6px;
`
export const CollapsingRow = styled.section`
    position: relative;
    display: flex;
    width: 100%;
    padding: 3px;
`
export const CollapsingColumnLeft = styled.section`
    width: 50%;
    text-align: start;
`
export const CollapsingColumnRight = styled.section`
    width: 50%;
    text-align: end;
`
export const CollapsingRouter = styled.section`
    width: 100%;
    background-color: cornflowerblue;
    border-radius: 5px;
    padding: 5px 10px 5px 5px;
`