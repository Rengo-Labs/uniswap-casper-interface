import styled from 'styled-components';
import {device} from "../../../contexts/ThemeContext/themes";

interface IPriceValue {
  percent?: boolean;
}

export const Wrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  border: 1px solid ${props => props.theme.NewBlackColor};
  border-radius: 25px;
  padding: 0 1rem;
  background-color: white;

  @media ${device.mobileS} {
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 2.1rem;
    padding: 16px;
  }
  
  @media ${device.tablet} {
    flex-wrap: nowrap;
    justify-content: center;
    gap: 1.5rem;
    padding: 0 1rem;
  }
`

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: .7rem;
`

export const Divider = styled.div`
  width: 1px;
  height: 60%;
  background-color: ${props => props.theme.NewGreyColor};
`

export const PriceTitle = styled.div`
  font-size: .9rem;
  font-weight: 500;
  color: #000;
  font-family: 'Epilogue';
`
export const PriceValue = styled.div<IPriceValue>`
  font-size: .9rem;
  color: ${props => props.percent ? props.theme.NewGreenColor : props.theme.NewGrayColor};
  font-family:  'Epilogue' ;
`

export const GraphicContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    @media ${device.mobileS} {
      flex: 100%;
      
      & > div {
        width: 100%;
        height: 100%;
      }

      & > div > svg {
        width: 100%;
        height: 21px;
      }
    }
  
    @media ${device.tablet} {
      flex: none;
    }
`
