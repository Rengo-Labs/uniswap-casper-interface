import React from 'react'
import NewLayout from '../../../layout/NewLayout'
import styled from 'styled-components'
import LiquidityNewModule from '../../organisms/LiquidityNewModule'
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

