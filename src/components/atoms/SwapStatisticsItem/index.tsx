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
  tokenPrice: ITokenPrice;
}

interface ISwapStatisticsItemProps {
  statistic: ISwapStatistics;
}

export const SwapStatisticsItem = ({ statistic }: ISwapStatisticsItemProps) => {
  const { token, tokenPrice } = statistic;

  return (
    <Wrapper>
      <Content>
        <TokenContainer>
          <NewTokenDetailItems2NSM src={token.logoURI} width={35} height={35} />
          <NewTokenDetailItems3NSM>{token.symbol}</NewTokenDetailItems3NSM>
        </TokenContainer>
        <PriceContainer>
          <PriceTitle>Price</PriceTitle>
          <PriceValue>${tokenPrice.nowPrice.toFixed(4)}</PriceValue>
        </PriceContainer>
        <PriceContainer>
          <PriceTitle>24H%</PriceTitle>
          <PriceValuePercent isNegative={tokenPrice.percent < 0}>{tokenPrice.percent.toFixed(4)}%</PriceValuePercent>
        </PriceContainer>
      </Content>
      <GraphicContainer>
       <Chart tokenOldPrice={tokenPrice.oneDayPrice} tokenCurrentPrice={tokenPrice.nowPrice}/>
      </GraphicContainer>
    </Wrapper>
  );
};
