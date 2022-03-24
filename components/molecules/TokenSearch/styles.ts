import styled from 'styled-components'

export const PoolSeachButtonStyled = styled.section`
    box-sizing: border-box;
    flex:1;
    background-color: ${prop => prop.theme.StrongColor3};
    display: flex;
    align-items: center;
    gap:.3rem;
    padding:0 .3rem;
    border-radius: 10px;
`

export const TokenContainerStyled = styled.section`
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content:space-between;
`