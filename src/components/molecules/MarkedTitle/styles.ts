import styled from 'styled-components'

export const StyledContainer = styled.h1`
    margin:0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap:.5em;
`
export const StyledTitle = styled.span`
    color:${props => props.theme.PrimaryColor};
`
export const StyledMarkedTitle = styled.span`
    color:${props => props.theme.TertiaryColor};
`