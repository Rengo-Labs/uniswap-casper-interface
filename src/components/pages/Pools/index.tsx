import React from 'react'

import {Button, CardContainer} from '../../atoms'
import { PoolModule } from '../../organisms'

import { BasicLayout } from '../../../layout/Basic'
import {useNavigate} from "react-router-dom";
export const Pools = () => {
    const navigate = useNavigate()
  return (
    <BasicLayout>
        <div style={{display: "flex", flexDirection: "row", justifySelf: "center", width: "68%", alignItems: "center", margin: "5% 0 10px 0"}}>
            <div style={{padding: "10px", backgroundColor: "#7864f4", marginRight: "1em"}}>TVL: $ 192.168.000.000</div>
            <div style={{padding: "10px", backgroundColor: "#7864f4", marginRight: "1em"}}>VOLUME: $ 1.000.000</div>
            <div style={{flex: "1"}}>
                <Button content="Create pool" handler={() => {navigate("/liquidity")}}></Button>
            </div>
        </div>
      <CardContainer cardTitle="Liquidity Pools" width="68%">
        <PoolModule />
      </CardContainer >
    </BasicLayout>
  )
}