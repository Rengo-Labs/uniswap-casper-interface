import styled from 'styled-components'

export const Container = styled.main`
    width: 100%;
    height: 100%;
    background-image: ${props => props.theme.backgroundColor} ;
    display: grid;
    grid-template: auto 1fr auto / 1fr;
`