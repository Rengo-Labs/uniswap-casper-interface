import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const POCTableStyled = styled.div`
    box-sizing: border-box;
    width: 100%;
    border-radius: 10px;
    text-align: center;
    border-collapse: collapse;
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  
    @media ${device.mobileL} {
      font-size: 14px;
      line-height: 18px;
    }
    
    @media ${device.laptop} {
      font-size: 16px;
      line-height: 32px;
    }
`
