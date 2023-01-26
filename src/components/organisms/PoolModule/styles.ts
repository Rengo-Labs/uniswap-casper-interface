import styled from 'styled-components'
import {device, deviceMax} from "../../../contexts/ThemeContext/themes";

export const PoolModulesStyled = styled.section`
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;

    @media ${device.mobileS} {
      padding: 0;
      gap: 8px;
    }
  
    @media ${device.laptopL} {
      padding: 32px;
    }
`

export const MenuStyled = styled.div`
    display: flex;
    width: 100%;
    /*width: 98%;*/
    padding: .6rem .7rem;
    
    @media ${device.mobileS} {
        flex-direction: column;
    }
    
    @media ${device.laptop} {
        flex-direction: row;
    }
    
    gap: 16px;
`

export const MenuToggleStyled = styled.div`
    
`

export const MenuTitleStyled = styled.div`
    flex: 1;
    color: black;
    
    letter-spacing: 0.02em;
    
    font-family: 'MyriadPro';
    
    @media ${device.mobileS} {
        font-size: 16px;
        line-height: 22px;
        text-align: left;
        align-self: left;
    }
    
    @media ${device.laptop} {
        font-size: 18px;
        line-height: 26px;
        text-align: left;
        margin-left: 1%;
        align-self: center;
    }
`

export const PoolMenu = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0;
    flex: 2;
    gap: 16px;
    
    @media ${device.mobileS} {
        flex-direction: column;
        align-items: flex-start;
    }
    
    @media ${device.laptop} {
        flex-direction: row;
    }
    
    @media ${device.laptopL} {
        align-items: center;
    }
`