import React from 'react'
import NewLayout from '../../../../layout/NewLayout'
import LiquidityNewModule from '../../organisms/LiquidityModule'
import { LiquidityNewContainerCC } from '../../atoms'

export const NewLiquidity = () => {
  return (
    <NewLayout>
      <LiquidityNewContainerCC>
        <LiquidityNewModule />
      </LiquidityNewContainerCC>
    </NewLayout>
  )
}

