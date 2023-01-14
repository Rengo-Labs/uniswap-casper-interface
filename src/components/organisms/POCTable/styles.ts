import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const POCTableStyled = styled.div`
    box-sizing: border-box;
    width: 100%;
    border-radius: 10px;
    text-align: center;
    font-size: 1vw;
    border-collapse: collapse;
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;

  @media ${device.mobileS} {
    font-size: 12px;
  }
  
  @media ${device.mobileL} {
    font-size: 14px;
  }
  
  @media ${device.tablet} {
    font-size: 1vw;
  }
`
