import React from 'react'

import { CardContainer } from '../../atoms'
//import { LiquidityModule } from '../../organisms'

import NewLayout from "../../../layout/NewLayout";

export const Add = () => {

  return (
    <NewLayout>
        <div style={{/*display: "grid", gridTemplateColumns: "repeat(11, 1fr)"*/}} >
            <CardContainer cardTitle="Add Liquidity">
                {/*<LiquidityModule />*/}
            </CardContainer >
        </div>
    </NewLayout>
  )
}