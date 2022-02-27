import styled from 'styled-components'

export const StyledContainer = styled.h1`
    display: flex;
    justify-content: center;
    align-items: center;
    gap:.5em;
`
export const StyledTitle = styled.h1`
    color:${props => props.theme.PrimaryColor};
`
export const StyledMarkedTitle = styled.h1`
    color:${props => props.theme.TertiaryColor};
`
