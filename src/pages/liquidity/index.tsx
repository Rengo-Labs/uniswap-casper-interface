import React from 'react'

import { CardContainer } from '../../components/atoms'
import { LiquidityBox } from '../../components/molecules'
import { LiquidityModule } from '../../components/organisms'

import { BasicLayout } from '../../layout/Basic'

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
