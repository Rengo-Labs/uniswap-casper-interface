import React from 'react'
import { useLocation } from 'react-router-dom'

import { CardContainer } from '../../atoms'
import { SwapModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}


export const Swap = () => {
  const query = useQuery()
  const tokenOne = query.get("tokenOne")

  return (
    <BasicLayout>
      <CardContainer cardTitle="Swap">
        <SwapModule tokenOne={tokenOne} />
      </CardContainer >
    </BasicLayout>
  )
}