import { useContext } from 'react'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { SwapStatisticsItem } from '../../atoms'
import { Wrapper, Main } from './styles'

export const SwapStatistics = () => {
  const {
    firstTokenSelected,
    secondTokenSelected,
  } = useContext(ConfigProviderContext)

  const stadistics = [
    {
      id: 1,
      token: firstTokenSelected,
      price: 1.456,
      percent: 12.05,
      grafic: 'grafic',
    },
    {
      id: 2,
      token: secondTokenSelected,
      price: 0.0251,
      percent: 4.12,
      grafic: 'grafic',
    }
  ]
  return (
      <Main>
        <Wrapper>
          {
            stadistics.map((stadistic) => (
                <SwapStatisticsItem key={stadistic.id} stadistic={stadistic} />
            ))
          }
        </Wrapper>
      </Main>
  )
}
