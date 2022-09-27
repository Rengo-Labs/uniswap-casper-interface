import React from 'react'

import { CardContainer } from '../../atoms'

import { BasicLayout } from '../../../layout/Basic'
import { LiquidityTemplate } from '../../templates/LiquidityTemplate'
import NewLayout from "../../../layout/NewLayout";

export const Liquidity = () => {

  return (
    <NewLayout>
      <CardContainer cardTitle="Liquidity">
        <LiquidityTemplate />
      </CardContainer >
    </NewLayout>
  )
}