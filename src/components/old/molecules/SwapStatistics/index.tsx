import { useContext, useEffect, useState } from 'react'
import { getPercentChangeByToken } from '../../../../commons/api/ApolloQueries'
import { Token } from '../../../../commons/api/types'
import { SwapStatisticsItem } from '../../atoms'
import { Wrapper, Main } from './styles'
import {TokensProviderContext} from "../../../../contexts/TokensContext";

export interface ITokenPrice {
  nowPrice: number;
  percent: number;
  oneDayPrice : number;
}

export const SwapStatistics = () => {
  const {
    firstTokenSelected,
    secondTokenSelected,
    tokenState
  } = useContext(TokensProviderContext)
  const [firstTokenPercent, setFirstTokenPercent] = useState<ITokenPrice[]>([{ nowPrice: 0, percent: 0, oneDayPrice: 0 }])
  const [secondTokenPercent, setSecondTokenPercent] = useState<ITokenPrice[]>([{ nowPrice: 0, percent: 0, oneDayPrice: 0 }])

  const getPercentage = async (token: Token) => {
    let currentToken = token
    if(token.symbol === 'CSPR') {
      currentToken = tokenState.tokens[currentToken.symbolPair]
    }
    return await getPercentChangeByToken(currentToken.packageHash?.slice(5))
  }

  useEffect(() => {
    getPercentage(firstTokenSelected).then(data => setFirstTokenPercent(data as ITokenPrice[]));
    getPercentage(secondTokenSelected).then(data => setSecondTokenPercent(data as ITokenPrice[]))
  }, [firstTokenSelected, secondTokenSelected])

  const statistics = [
    {
      id: 1,
      token: firstTokenSelected,
      price: Number(firstTokenSelected.priceUSD),
      tokenPrice: firstTokenPercent,
    },
    {
      id: 2,
      token: secondTokenSelected,
      price: Number(secondTokenSelected.priceUSD),
      tokenPrice: secondTokenPercent,
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
