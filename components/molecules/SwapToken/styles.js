import styled from 'styled-components'

export const SwapTokenStyled = styled.section`
    border-radius: 10px;
    padding: .2rem;
    display: grid;
    grid-template-columns: repeat(6,1fr);
    align-items: center;
    background-color: ${props => props.theme.StrongColor3};
    cursor: pointer;
`
export const SwapIconStyled = styled.section`
    grid-column:1/2;    
`
export const SwapIconImageStyled = styled.img`
    border-radius: 50%;;    
`
export const SwapNamingStyled = styled.section`
    grid-column:2/3;
`
export const SwapAmountStyled = styled.section`
    grid-column:6/7;
`
