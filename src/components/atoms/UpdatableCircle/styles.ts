import styled from 'styled-components'

export const TrailCircular = styled.path<any>`
    stroke: ${props => props.isPrincipal ? props.theme.secondBackgroundColor : 'transparent'};

    stroke-dasharray: ${ props => props.diameter}px ${props => props.diameter}px;
    stroke-dashoffset: ${ props => ((100 - props.percentage) / 100 * props.diameter)}px;
`
