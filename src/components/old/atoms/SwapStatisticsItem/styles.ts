import styled from 'styled-components';
import {device} from "../../../../contexts/ThemeContext/themes";

interface IPriceValue {
  isNegative?: boolean;
}

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.NewBlackColor};
  align-items: center;
  border-radius: 25px;
  background-color: white;

  @media ${device.tablet} {
    flex-direction: row;
  }
`;

export const Content = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 0 16px;
  width: 100%;

  @media ${device.mobileS} {
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 2.1rem;
    padding: 16px;
  }

  @media ${device.tablet} {
    flex-wrap: nowrap;
    justify-content: left;
    gap: 1.5rem;
    padding: 0 1rem;
  }
`;

export const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1.5;
`;

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 0.7rem;
  flex: 1;
`;

export const Divider = styled.div`
  width: 1px;
  height: 40px;
  background-color: ${(props) => props.theme.NewGreyColor};
`;

export const PriceTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #000;
  font-family: 'Epilogue';
`;

export const PriceValue = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.NewGrayColor};
  font-family: 'Epilogue';
`;

export const PriceValuePercent = styled.div<IPriceValue>`
  font-size: 0.9rem;
  color: ${(props) => props.isNegative ? 'red' : props.theme.NewGreenColor};
  font-family: 'Epilogue';
`;

export const GraphicContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0;

  @media ${device.mobileS} {
    flex: 1;
    padding-bottom: 10px;

    & > div {
      width: 100%;
      height: 100%;
    }

    & > div > svg {
      width: 100%;
      height: 34px;
    }
  }

  @media ${device.tablet} {
    flex: none;
  }
`;
