import React from 'react'
import { useRouter } from 'next/router'

import { CardContainer } from '../../components/atoms'
import { SwapModule } from '../../components/organisms'

import { BasicLayout } from '../../layout/Basic'

const Swap = () => {
  const router = useRouter()
  const tokenOne = router.query?.tokenOne

  return (
    <BasicLayout>
      <CardContainer cardTitle="Swap">
        <SwapModule tokenOne={tokenOne} />
      </CardContainer >
    </BasicLayout>
  )
}

export default Swap
