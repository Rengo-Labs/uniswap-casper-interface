import styled from 'styled-components'

export const StyledInfoBox = styled.section`
    color: ${props => props.theme.PrimaryColor};
    background-color: ${props => props.theme.StrongColor2};
    padding: .8rem 1rem ;
    display:flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
`
export const StyledInfoBoxTitle = styled.h1`
    margin:0;
    font-size:3rem;
`
export const StyledInfoBoxSmall = styled.h2`
    margin:0;
    font-size:1rem;
    color: rgba(255,255,255,.8);
`