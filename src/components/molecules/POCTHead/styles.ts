import styled from 'styled-components';

export const THeadStyled = styled.div`
    display: flex;
    border-radius: 16px;
    border: 1px solid black;
    padding: .84rem 2rem;
    font-family: 'MyriadProSemiBold';
    color: ${props => props.theme.NewBlackColor};
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.02em;
`

export const THeader6Styled = styled.div`
    flex: 6;
    display: flex;
    justify-content: center;
    place-items: center;
    background-color: transparent;
    gap: 16px;
`

export const THeader3Styled = styled.div`
    flex: 3;
    justify-content: center;
    display: flex;
    place-items: center;
    background-color: transparent;
    gap: 16px;
`

export const THeaderStyled = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    place-items: center;
    background-color: transparent;
`

export const THeaderTitle = styled.div`
    /*margin-right: 20px;*/
`