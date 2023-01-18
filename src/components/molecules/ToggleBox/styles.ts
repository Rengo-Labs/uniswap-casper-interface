import styled from "styled-components";
import {device} from "../../../contexts/ThemeContext/themes";

export const WrapToggle = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    
    @media ${device.mobileS} {
        flex-direction: row;
    }
    
    @media ${device.laptop} {
        flex-direction: column;
    }
    
    @media ${device.laptopL} {
        flex-direction: row;
    }
`

export const ToggleTitle = styled.div`
    align-self: center;
    text-align: left;
    color: #715FF5;
    font-family: 'MyriadProLight';
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.02em;
`