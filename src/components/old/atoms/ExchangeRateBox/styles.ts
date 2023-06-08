import styled from 'styled-components';
import { PriceImpactTitle } from '../PriceImpactTitle';

export const ExchangeRateContainer = styled.section`
  position: relative;
  display: block;
  align-self: center;
  padding: 3px;
`;
export const ExchangeRateRow = styled.section`
  position: relative;
  display: flex;
  width: 100%;
`;
export const ExchangeRateColumnLeft = styled.section`
  padding-right: 10px;
  text-align: left;
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 30px;
  text-align: right;
  letter-spacing: 0.02em;
`;
export const ExchangeRateColumnRight = styled.section`
  text-align: left;
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 30px;
  text-align: right;
  letter-spacing: 0.02em;
`;
export const PriceImpactLabel = styled(PriceImpactTitle)`
  transition: color 1s;
  color: ${(props) =>
    props.priceImpact <= 1 || props.priceImpact === '<0.01'
      ? 'green'
      : props.priceImpact > 1 && props.priceImpact <= 5
      ? 'orange'
      : 'red'};
`;
