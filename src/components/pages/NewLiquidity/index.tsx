import React from 'react'
import NewLayout from '../../../layout/NewLayout'
import { LiquidityNewContainer } from '../../atoms/LiquidityNewContainer'
import { LiquidityModule } from '../../organisms'
import { LiquidityNewModule } from '../../organisms/LiquidityNewModule'

export const NewLiquidity = () => {
    return (
        <NewLayout>
            <LiquidityNewContainer>
                <LiquidityModule>
                    <LiquidityNewModule />
                </LiquidityModule>
            </LiquidityNewContainer>
        </NewLayout>
    )
}
