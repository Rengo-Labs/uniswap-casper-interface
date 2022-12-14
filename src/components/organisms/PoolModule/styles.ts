import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const PoolModulesStyled = styled.section`
    margin: 0;
    padding:20px 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;

  @media ${device.mobileS} {
    padding: 2px;
  }
  
`

export const MenuStyled = styled.div`
    display: flex;
    width: 98%;
    padding: .6rem .7rem
`

export const MenuToggleStyled = styled.div`
    flex: 1;
    align-self: center;
`

export const MenuTitleStyled = styled.div`
    flex: 3;
    align-self: center;
    color: black;
    margin-left: 1%;
    font-family: 'Epilogue'; 
    font-size: 1em;
`

export const WrapToggle = styled.div`
    display: flex;
`
