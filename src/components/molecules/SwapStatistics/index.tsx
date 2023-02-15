import { useContext } from 'react'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { SwapStatisticsItem } from '../../atoms'
import { Wrapper, Main } from './styles'

export const SwapStatistics = ({token0Price, token1Price, token0Per, token1Per}) => {
  const {
    firstTokenSelected,
    secondTokenSelected,
  } = useContext(ConfigProviderContext)

  const statistics = [
    {
      id: 1,
      token: firstTokenSelected,
      price: Number(firstTokenSelected.priceUSD),
      percent: token0Per,
      graphic: "graphic",
    },
    {
      id: 2,
      token: secondTokenSelected,
      price: Number(secondTokenSelected.priceUSD),
      percent: token1Per,
      graphic: "graphic",
    },
  ];
  return (
      <Main>
        <Wrapper>
          {
            statistics.map((statistic) => (
                <SwapStatisticsItem key={statistic.id} statistic={statistic} />
            ))
          }
        </Wrapper>
      </Main>
  )
}
