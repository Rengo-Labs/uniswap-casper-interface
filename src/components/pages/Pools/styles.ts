import styled from 'styled-components'
import {device, deviceMax} from "../../../contexts/ThemeContext/themes";

export const WrappedPool = styled.div`
    display: grid; 
    grid-template-columns: repeat(11, 1fr)
`

export const WrappedHeaderPool = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    align-self: end;
    grid-row: 1;
    grid-column: 2/11;
    font-family: 'MyriadPro';
    
    @media ${deviceMax.tablet} {
        grid-column: 1/11;
        width: 100%;
    }
`

export const HeaderPool = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.25rem 1rem;
    color: black;
    font-size: 22px;
    line-height: 30px;
    letter-spacing: 0.02em;
    gap: 8px;
    color: ${props => props.theme.secondBackgroundColor};
`

export const WrappedPoolTitle = styled.div`
    align-items: end;
    
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 16px;
    border-radius: 8px;
    
    @media ${deviceMax.tablet} {
        flex-direction: column;
        width: 100%;
    }
`

export const TitleBox = styled.div`
    padding: 1rem 1.56rem;
    background-color: ${props => props.theme.secondBackgroundColor};
    height: 3.625 rem; 
    display: flex; 
    align-items: center;
    font-size: 18px;
    line-height: 26px;
    border-radius: 8px;
    letter-spacing: 0.02em;
    
    @media ${deviceMax.mobileL} {
        font-size: 14px;
        line-height: 18px;
        width: 100%;
    }
    
    @media ${deviceMax.laptop} {
        font-size: 16px;
        line-height: 22px;
        width: 100%;
    }
    
    @media ${device.laptopL} {
        font-size: 18px;
        line-height: 26px;
    }
`
export const Column6 = styled.div`
    flex: 6;
`
export const Column1 = styled.div`
    flex: 1.2;
`

interface PoolButton {
  enabled: boolean,
}

export const CreatePoolButton = styled.button<PoolButton>`
    color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGrayColor};
    background-color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGreyColor};
    border-radius: 10px;
    border:none;
    justify-content: center;
    align-items: center;
    display: grid;
    height: 3.625rem;
    padding: 1rem 1.56rem;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.02em;
    font-family: 'MyriadPro';
    
    &:hover{
        cursor: pointer;
    }
    &:active{
        color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGrayColor};
        background-color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGreyColor};
    }
`