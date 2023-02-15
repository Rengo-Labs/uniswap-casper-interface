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
import { ReactComponent as Graphic } from '../../../assets/newIcons/graphics.svg';
import { NewIcons } from '../NewIcons';
import { useTheme } from 'styled-components';
import { LightThemeInterface } from '../../../contexts/ThemeContext/themes';

export interface ISwapStatistics {
  id: number;
  token: any; // FIXME: Set type
  price: number;
  percent: number;
  graphic: string;
}

interface ISwapStatisticsItemProps {
  statistic: ISwapStatistics;
}

export const SwapStatisticsItem = ({ statistic }: ISwapStatisticsItemProps) => {
  const theme = useTheme() as LightThemeInterface;
  const { token, price, percent } = statistic;

  return (
    <Wrapper>
      <Content>
        <TokenContainer>
          <NewTokenDetailItems2NSM src={token.logoURI} width={35} height={35} />
          <NewTokenDetailItems3NSM>{token.symbol}</NewTokenDetailItems3NSM>
        </TokenContainer>
        <PriceContainer>
          <PriceTitle>Price</PriceTitle>
          <PriceValue>${price.toFixed(4)}</PriceValue>
        </PriceContainer>
        <PriceContainer>
          <PriceTitle>24H%</PriceTitle>
          <PriceValue percent={true}>{percent}%</PriceValue>
        </PriceContainer>
      </Content>
      <GraphicContainer>
        <NewIcons
          Icon={Graphic}
          height={40}
          width={220}
          style={{ fill: theme.NewPurpleColor }}
        />
      </GraphicContainer>
    </Wrapper>
  );
};
