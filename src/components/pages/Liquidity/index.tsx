import React from 'react'

import { CardContainer } from '../../atoms'
import { LiquidityBox } from '../../molecules'
import { LiquidityModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'

export const Liquidity = () => {

  return (
    <BasicLayout>
      <CardContainer cardTitle="Add Liquidity">
        <LiquidityModule />
      </CardContainer >
    </BasicLayout>
  )
}