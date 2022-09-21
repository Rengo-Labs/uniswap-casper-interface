import React from 'react'

import { CardContainer } from '../../atoms'

import { BasicLayout } from '../../../layout/Basic'
import { LiquidityTemplate } from '../../templates/LiquidityTemplate'

export const Liquidity = () => {

  return (
    <BasicLayout>
      <CardContainer cardTitle="Liquidity">
        <LiquidityTemplate />
      </CardContainer >
    </BasicLayout>
  )
}