import { NewTokenDetailItems2NSM } from '../NewTokenDetailItems2NSM';
import { NewTokenDetailItems3NSM } from '../NewTokenDetailItems3NSM';
import { PriceValue, PriceContainer, PriceTitle, Wrapper, Divider } from './styles';
import { ReactComponent as Grapich } from '../../../assets/newIcons/graphics.svg'
import { NewIcons } from '../NewIcons';

export interface ISwapStadistics {
  id: number;
  token: any;
  price: number;
  percent: number;
  grafic: string;
}

interface ISwapStadisticsItemProps {
  stadistic: ISwapStadistics;
}

export const SwapStadisticsItem = ({ stadistic }: ISwapStadisticsItemProps) => {
  const { id, token, price, percent, grafic } = stadistic;
  return (
    <Wrapper>
      <NewTokenDetailItems2NSM src={token.logoURI} width={35} height={35}/>
      <NewTokenDetailItems3NSM>
        {token.symbol}
      </NewTokenDetailItems3NSM>
      <Divider/>
      <PriceContainer>
        <PriceTitle>Price</PriceTitle>
        <PriceValue>$ {price}</PriceValue>
      </PriceContainer>
      <PriceContainer>
        <PriceTitle>24H%</PriceTitle>
        <PriceValue percent={true}>{percent}%</PriceValue>
      </PriceContainer>
      <NewIcons Icon={Grapich} height={40} width={98} style={{ fill: '#715ff5' }}/>
    </Wrapper>
  );
};
