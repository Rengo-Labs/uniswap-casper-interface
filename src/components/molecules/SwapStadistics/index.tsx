import { useContext } from 'react'
import { ConfigProviderContext } from '../../../contexts/ConfigContext'
import { SwapStadisticsItem } from '../../atoms'
import { Wrapper } from './styles'



export const SwapStadistics = () => {
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
    <Wrapper>
      {
        stadistics.map((stadistic) => (
          <SwapStadisticsItem key={stadistic.id} stadistic={stadistic} />
        ))
      }
    </Wrapper>
  )
}