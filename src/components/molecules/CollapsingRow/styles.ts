import styled from 'styled-components'
import {device} from "../../../contexts/ThemeContext/themes";

export const TWrapCardRow = styled.div`
    background-color: #FFFFFF;
    border-radius: 16px;
    border: 1px solid black;
    padding: 1rem 1.5rem;
    background-color: white;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.02em;
`

export const TThirdRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 16px;
    border: 1px solid black;
    padding: 1rem 0rem;
    background-color: white;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.02em;
    border: 0;
    text-align: left;
`

export const TWrapRow = styled.div`
    border-radius: 16px;
    padding: 1rem 2rem;
    background-color: white;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.02em;
    
    @media ${device.laptop} {
      display: block;
      border: 1px solid black;
    }
`

export const WrappedRow = styled.div`
    display: flex;
    width: 100%;
    padding: .5rem 0 0;
    
    @media ${device.mobileS} {
      flex-direction: column;
    }
    
    @media ${device.laptop} {
      flex-direction: row;
    }
`

export const TFirstRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const TRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
`

export const TLeftRow = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 8px;
`

export const TitleStyled = styled.div`
    color: black;
    font-family: "MyriadProSemiBold";
    font-size: 14px;
    line-height: 18px;
`

export const ValueStyled = styled.div`
    color: black;
    font-family: 'MyriadPro';
    font-size: 14px;
    line-height: 18px;
`

export const TColumn6 = styled.div`
    flex: 6;
`

export const TColumn3 = styled.div`
    flex: 3;
`

export const TColumn1 = styled.div`
    flex: 1;
`

export const TClickableColumn1 = styled.div`
    cursor: pointer;
    flex: 1;
`

export const TColumn2andHalf = styled.div`
    @media ${device.tablet} {
      flex: 0;
    }
    
    @media ${device.laptopL} {
      flex: 2.5;
    }
`

export const PairTitleColumn = styled.div`
  flex: 3; 
  align-self: center;
  text-align: center;
`

export const IconColumn1 = styled.div`
  align-self: center; 
  display: flex;
  flex: 1;
`

export const TitleBodyRow = styled.div`
  
  font-family: "MyriadProSemiBold";
  color: ${props => props.theme.secondBackgroundColor}
  
  @media ${device.mobileS} {
    text-align: left;
  }
  
  @media ${device.laptop} {
    font-size: 12px; 
    line-height: 14px; 
    
    text-align: center;
    flex: 3;
  }
  
  @media ${device.laptopL} {
    font-size: 16px; 
    line-height: 32px; 
  }
`

export const NormalBodyRow = styled.div`
  flex: 3;
  font-family: "MyriadPro";
  
  @media ${device.mobileS} {
    text-align: left;
    font-size: 16px; 
    line-height: 32px; 
  }
  
  @media ${device.laptop} {
    font-size: 12px; 
    line-height: 14px;
    text-align: center;  
  }
  
  @media ${device.laptopL} {
    text-align: center; 
    font-size: 16px; 
    line-height: 32px; 
  }
`

export const TSecondRow = styled.div`
    display: flex;
    justify-items: left;
`

export const AddLiquidityButton = styled.button<any>`
    color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGrayColor};
    background-color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGreyColor};
    border:none;
    align-items: center;
    
    letter-spacing: 0.02em;
    font-family: 'MyriadPro';
    display: flex; 
    border-radius: 8px; 
    padding: 0.25rem 1.375rem; 
    height: 2.5rem; 
    justify-content: center; 
    
    &:hover{
        cursor: pointer;
    }
    &:active{
        color: ${props => props.enabled ? props.theme.thirdBackgroundColor : props.theme.NewGrayColor};
        background-color: ${props => props.enabled ? props.theme.secondBackgroundColor : props.theme.NewGreyColor};
    }
    
    @media ${device.mobileS} {
        font-size: 14px;
        line-height: 18px;
    }
    
    @media ${device.laptop} {
        font-size: 12px;
        line-height: 14px;
        padding: .25rem .375rem; 
    }
    
    @media ${device.laptopL} {
        font-size: 16px;
        line-height: 32px;
        padding: 1rem 1.54rem; 
    }
`

export const TBodyColumn6 = styled.div`
    flex: 6;
    padding: 0.3rem 0 0;
`

export const TButtonColumn3 = styled.div`
  flex: 3;
  padding: 0.25rem 0 0;
`

export const TBodyColumn3 = styled.div`
  flex: 3;
  padding: 0.3rem 0 0;
`

export const TBodyExpanded = styled.div`
    display: flex;
`