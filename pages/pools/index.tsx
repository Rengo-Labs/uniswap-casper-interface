import React from 'react'

import { CardContainer } from '../../components/atoms'
import { PoolModule } from '../../components/organisms'

import { BasicLayout } from '../../layout/Basic'
const Swap = () => {
  
  return (
    <BasicLayout>
      <CardContainer cardTitle="Top Pools" width="68%">
        <PoolModule />
      </CardContainer >
    </BasicLayout>
  )
}

export default Swap
