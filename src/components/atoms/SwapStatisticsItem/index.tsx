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
} from './styles';
import { ReactComponent as Grapich } from '../../../assets/newIcons/graphics.svg';
import { NewIcons } from '../NewIcons';

export interface ISwapStatistics {
  id: number;
  token: any;
  price: number;
  percent: number;
  grafic: string;
}

interface ISwapStatisticsItemProps {
  stadistic: ISwapStatistics;
}

export const SwapStatisticsItem = ({ stadistic }: ISwapStatisticsItemProps) => {
  const { token, price, percent } = stadistic;
  return (
    <Wrapper>
      <Content>
        <TokenContainer>
          <NewTokenDetailItems2NSM src={token.logoURI} width={35} height={35} />
          <NewTokenDetailItems3NSM>{token.symbol}</NewTokenDetailItems3NSM>
        </TokenContainer>
        <Divider />
        <PriceContainer>
          <PriceTitle>Price</PriceTitle>
          <PriceValue>${price}</PriceValue>
        </PriceContainer>
        <PriceContainer>
          <PriceTitle>24H%</PriceTitle>
          <PriceValue percent={true}>{percent}%</PriceValue>
        </PriceContainer>
      </Content>
      <GraphicContainer>
        <NewIcons
          Icon={Grapich}
          height={40}
          width={220}
          style={{ fill: '#715ff5' }}
        />
      </GraphicContainer>
    </Wrapper>
  );
};
