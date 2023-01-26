import styled from 'styled-components'
import {device, deviceMax} from "../../../contexts/ThemeContext/themes";

export const WrappedPool = styled.div`
    height: 5rem;
    @media ${device.mobileS} {
        display: flex;
        flex-direction: column;
    }
    
    @media ${device.laptop} {
        display: grid; 
        grid-template-columns: repeat(11, 1fr)
    }
`

export const WrappedHeaderPool = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    grid-row: 1;
    font-family: 'MyriadPro';
    flex: none;
    
    @media ${device.mobileS} {
        width: auto;
        padding: 0 1rem;
    }
    
    
    @media ${device.laptop} {
        grid-column: 2/11;
        align-self: end;
        padding: 0;
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
    
    flex: none;
    order: 0;
    flex-grow: 0;
    
    color: ${props => props.theme.secondBackgroundColor};
`

export const WrappedPoolTitle = styled.div`
    align-items: end;
    
    display: flex;
    align-items: flex-start;
    padding: 0px;
    gap: 16px;
    border-radius: 8px;
    
    flex: none;
    order: 1;
    
    @media ${device.mobileS} {
        flex-direction: column;
        width: 100%;
    }
    
    @media ${device.laptop} {
        flex-direction: row;
        width: auto;
    }
`

export const TitleBoxWrapper = styled.div`
    @media ${device.mobileS} {
        width: 100%;
    }
    
    @media ${device.laptop} {
        width: auto;
    }
`

export const TitleBox = styled.div`
    padding: 1rem 1.56rem;
    background-color: ${props => props.theme.secondBackgroundColor};
    height: 1.625rem; 
    display: flex; 
    align-items: center;
    border-radius: 8px;
    letter-spacing: 0.02em;
    
    @media ${device.mobileS} {
        font-size: 14px;
        line-height: 18px;
    }
    
    @media ${device.laptop} {
        font-size: 18px;
        line-height: 26px;
        width: auto;
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