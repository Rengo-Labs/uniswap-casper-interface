import {useMemo} from 'react';
import { NewTokenDetailItems2NSM } from '../NewTokenDetailItems2NSM';
import { NewTokenDetailItems3NSM } from '../NewTokenDetailItems3NSM';
import {
  PriceValue,
  PriceContainer,
  PriceTitle,
  Wrapper,
  Divider,
  GraphicContainer,
  TokenContainer,
  Content,
  PriceValuePercent,
} from './styles';
import { Chart } from '../Chart';
import { ITokenPrice } from '../../molecules/SwapStatistics';

export interface ISwapStatistics {
  id: number;
  token: any; // FIXME: Set type
  price: number;
  tokenPrice: ITokenPrice[];
}

interface ISwapStatisticsItemProps {
  statistic: ISwapStatistics;
}

export const SwapStatisticsItem = ({ statistic }: ISwapStatisticsItemProps) => {
  const { token, tokenPrice } = statistic;
  const chartData = tokenPrice.map((item, index) => {
    if (index === 0) {
      return {
        name: `Now`,
        price: item.nowPrice,
      };
    }
    return {
      name: `Price ${index} day ago`,
      price: item.nowPrice,
    };
  });
 // console.log('chartData',chartData);
  return (
    <Wrapper>
      <Content>
        <TokenContainer>
          <NewTokenDetailItems2NSM src={token.logoURI} width={35} height={35} />
          <NewTokenDetailItems3NSM>{token.symbol}</NewTokenDetailItems3NSM>
        </TokenContainer>
        <PriceContainer>
          <PriceTitle>Price</PriceTitle>
          <PriceValue>${tokenPrice[0].nowPrice.toFixed(4)}</PriceValue>
        </PriceContainer>
        <PriceContainer>
          <PriceTitle>24H%</PriceTitle>
          <PriceValuePercent isNegative={tokenPrice[0].percent < 0}>
            {tokenPrice[0].percent.toFixed(4)}%
          </PriceValuePercent>
        </PriceContainer>
      </Content>
      <GraphicContainer>
        <Chart chartData={chartData.reverse()} />
      </GraphicContainer>
    </Wrapper>
  );
};
