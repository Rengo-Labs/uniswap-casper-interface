import styled from 'styled-components'

export const SwapTokenStyled = styled.section`
    border-radius: 10px;
    padding: .2rem;
    display: grid;
    place-items: center;
    grid-template-columns: repeat(6,1fr);
    background-color: ${props => props.theme.StrongColor3};
    cursor: pointer;
    gap: .5rem;
`
export const SwapIconStyled = styled.section`
    grid-column:1/2;
    display: grid;
    place-items: center;
`
export const SwapIconImageStyled = styled.img`
    border-radius: 50%;
    
`
export const SwapNamingStyled = styled.section`
    grid-column:2/3;
    justify-self:start;
`
