import styled from 'styled-components'

export const TrailCircular = styled.path<any>`
    stroke: ${props => props.isPrincipal ? props.theme.secondBackgroundColor : '#CCC'};

    
`
