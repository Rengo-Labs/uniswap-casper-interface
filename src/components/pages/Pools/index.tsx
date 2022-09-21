import React from 'react'

import { CardContainer } from '../../atoms'
import { PoolModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'
export const Pools = () => {
  
  return (
    <BasicLayout>
      <CardContainer cardTitle="Top Pools" width="68%">
        <PoolModule />
      </CardContainer >
    </BasicLayout>
  )
}