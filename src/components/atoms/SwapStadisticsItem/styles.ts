import styled from 'styled-components';

interface IPriceValue {
  percent?: boolean;
}

export const Wrapper = styled.div`
  display: flex;
  gap:3rem;
  align-items: center;
  border: 1px solid ${props => props.theme.NewGreyColor};
  border-radius: 25px;
  padding: 0 1rem;
`

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: .5rem;
`

export const Divider = styled.div`
  width: 1px;
  height: 60%;
  background-color: ${props => props.theme.NewGreyColor};
`

export const PriceTitle = styled.div`
  font-size: .9rem;
  font-weight: 600;
  color: #000;
  font-family: 'EpilogueLight';
`
export const PriceValue = styled.div<IPriceValue>`
  font-size: 1rem;
  color: ${props => props.percent ? props.theme.thirdBackgroundColor : 'black'};
  font-family:  ${props => props.percent ? 'EpilogueBold' : 'EpilogueLight' };
`