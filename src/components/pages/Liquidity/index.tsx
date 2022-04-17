import React from 'react'

import { CardContainer } from '../../atoms'
import { LiquidityBox } from '../../molecules'
import { LiquidityModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'

const Liquidity = () => {

  return (
    <BasicLayout>
      <CardContainer cardTitle="Add Liquidity">
        <LiquidityModule />
      </CardContainer >
      <CardContainer cardTitle="Your Liquidity">
        <LiquidityBox />
      </CardContainer >
    </BasicLayout>
  )
}

export default Liquidity
