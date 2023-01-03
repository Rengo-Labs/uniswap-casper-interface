import styled from 'styled-components';

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
