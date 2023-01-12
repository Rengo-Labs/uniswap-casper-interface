import styled from 'styled-components';

export const THeadStyled = styled.div`
    display: flex;
    border-radius: 10px;
    border: 2px solid black;
    padding: 7px 0px;
    color: ${props => props.theme.SecondBlackColor};
    font-family: 'MyriadProSemiBold';
`

export const THeadArrowStyled = styled.div`
    color: ${props => props.theme.NewPurpleColor};
`

export const THeader6Styled = styled.div`
    flex: 6;
    display: flex;
    justify-content: center;
    place-items: center;
    background-color: transparent;
`

export const THeader3Styled = styled.div`
    flex: 3;
    justify-content: center;
    display: flex;
    place-items: center;
    background-color: transparent;
`

export const THeaderStyled = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    place-items: center;
    background-color: transparent;
`

export const THeaderTitle = styled.div`
    margin-right: 10px;
    color: ${props => props.theme.SecondBlackColor};
    font-family: 'MyriadProSemiBold';
`