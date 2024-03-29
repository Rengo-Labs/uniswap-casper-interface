import styled from 'styled-components'

interface CollapsingContainer {
    fullWidth: boolean
}

export const CollapsingContainerStyled = styled.div<CollapsingContainer>`
    background-color: white;
    width: ${props => props.fullWidth ? '100%' : ''};
    padding: 0.5rem 1rem;
    border-radius: 10px;
    grid-template-rows: auto auto;
`
export const CollapsingHeader = styled.section`
    padding: 6px;
    cursor: pointer;
`
export const CollapsingBody = styled.div`
    padding: 6px;
`
export const CollapsingRow = styled.div`
    display: flex;
    padding-top: 10px;
`
export const CollapsingColumnLeft = styled.div`
    flex: 1;
    text-align: left;
`
export const CollapsingColumnRight = styled.div`
    flex: 1;
    text-align: right;
`