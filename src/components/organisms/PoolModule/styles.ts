import styled from 'styled-components'
import {device, deviceMax} from "../../../contexts/ThemeContext/themes";

export const PoolModulesStyled = styled.section`
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;

  @media ${device.mobileS} {
    padding: 32px;
    gap: 8px;
  }
  
`

export const MenuStyled = styled.div`
    display: flex;
    width: 100%;
`

export const MenuToggleStyled = styled.div`
    
`

export const MenuTitleStyled = styled.div`
    flex: 3;
    align-self: center;
    color: black;
    margin-left: 1%;
    letter-spacing: 0.02em;
    
    font-family: 'MyriadPro';
    font-size: 18px;
    line-height: 26px;
    
    @media ${deviceMax.laptopL} {
        font-size: 16px;
        line-height: 22px;
    }
`

export const PoolMenu = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0;
    flex: 2;
    gap: 16px;
`

export const WrapToggle = styled.div`
    display: flex;
`
