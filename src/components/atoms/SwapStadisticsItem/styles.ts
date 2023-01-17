import styled from 'styled-components';
import { device } from '../../../contexts/ThemeContext/themes';

interface IPriceValue {
  percent?: boolean;
}

export const Wrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  border: 1px solid ${(props) => props.theme.NewBlackColor};
  border-radius: 25px;
  padding: 0 1rem;
  background-color: white;

  @media ${device.mobileS} {
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-evenly;
    padding: 16px;
    gap: 1.2rem;
  }

  @media ${device.tablet} {
    flex-wrap: nowrap;
    justify-content: center;
    gap: 1.5rem;
    padding: 0 1rem;
    width: auto;
  }
`;

export const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 6px 0;
`;

export const Divider = styled.div`
  width: 1px;
  height: 50px;
  background-color: ${(props) => props.theme.NewGreyColor};
`;

export const PriceTitle = styled.div`
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${(props) => props.theme.SecondBlackColor};
`;
export const PriceValue = styled.div<IPriceValue>`
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 32px;
  letter-spacing: 0.02em;
  color: ${(props) => props.theme.NewGrayColor};
`;

export const GraphicContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media ${device.mobileS} {
    flex: 1;

    & > div {
      flex: 1;
      height: 100%;
    }

    & > div > svg {
      width: 100%;
      height: 25px;
    }
  } 

  @media ${device.tablet} {
    flex: none;
  } 
`;
