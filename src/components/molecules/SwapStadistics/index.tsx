import { useContext } from 'react'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { SwapStadisticsItem } from '../../atoms'
import { Wrapper, Main } from './styles'

export const SwapStadistics = ({token0Price, token1Price, token0Per, token1Per}) => {
  const {
    firstTokenSelected,
    secondTokenSelected,
  } = useContext(ConfigProviderContext)

  const stadistics = [
    {
      id: 1,
      token: firstTokenSelected,
      price: token0Price,
      percent: token0Per,
      grafic: 'grafic',
    },
    {
      id: 2,
      token: secondTokenSelected,
      price: token1Price,
      percent: token1Per,
      grafic: 'grafic',
    }
  ]
  return (
      <Main>
        <Wrapper>
          {
            stadistics.map((stadistic) => (
                <SwapStadisticsItem key={stadistic.id} stadistic={stadistic} />
            ))
          }
        </Wrapper>
      </Main>
  )
}
