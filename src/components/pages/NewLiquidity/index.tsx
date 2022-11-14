import React from 'react'
import NewLayout from '../../../layout/NewLayout'
import LiquidityNewModule from '../../organisms/LiquidityNewModule'
import { LiquidityNewContainer } from '../../atoms/LiquidityNewContainer'

export const NewLiquidity = () => {
    return (
        <NewLayout>
            <LiquidityNewContainer>
                    <LiquidityNewModule />
            </LiquidityNewContainer>
        </NewLayout>
    )
}
