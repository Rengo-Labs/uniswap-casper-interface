import styled from 'styled-components';
import {device} from "../../../../contexts/ThemeContext/themes";
export const THeadStyled = styled.div`
    border-radius: 16px;
    border: 1px solid black;
    padding: .84rem 2rem;
    font-family: 'MyriadProSemiBold';
    color: ${props => props.theme.NewBlackColor};
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.02em;
    
    @media ${device.mobileS} {
        display: none;
    }
    
    @media ${device.laptop} {
        display: flex;
    }
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
    gap: 16px;
`

export const THeader3Styled = styled.div`
    flex: 3;
    display: flex;
    place-items: center;
    background-color: transparent;
    gap: 16px;
    
    @media ${device.mobileS} {
        justify-content: right;
        padding-top: .5rem;
        padding-bottom: .5rem;
    }
    
    @media ${device.laptop} {
        justify-content: right;
        padding-top: 0;
        padding-bottom: 0;
    }
    
    @media ${device.laptopL} {
        justify-content: center;
        padding-top: 0;
        padding-bottom: 0;
    }
`

export const THeaderStyled = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    place-items: center;
    background-color: transparent;
`

export const THeaderTitle = styled.div`
    color: ${props => props.theme.SecondBlackColor};
    font-family: 'MyriadProSemiBold';
`
