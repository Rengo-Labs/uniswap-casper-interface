import React from 'react'

import { CardContainer } from '../../atoms'
import { LiquidityModule } from '../../organisms'

import NewLayout from "../../../layout/NewLayout";

export const Add = () => {

  return (
    <NewLayout>
      <CardContainer cardTitle="Add Liquidity">
        <LiquidityModule />
      </CardContainer >
    </NewLayout>
  )
}