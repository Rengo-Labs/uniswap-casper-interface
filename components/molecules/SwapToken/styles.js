import styled from 'styled-components'

export const SwapTokenStyled = styled.section`
    border-radius: 10px;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(6,1fr);
    align-items: center;
    border-style: outset;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
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
