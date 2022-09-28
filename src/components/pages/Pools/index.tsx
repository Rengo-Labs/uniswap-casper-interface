import React from 'react'

import {Button, CardContainer} from '../../atoms'
import { PoolModule } from '../../organisms'

import {useNavigate} from "react-router-dom";
import NewLayout from "../../../layout/NewLayout";
export const Pools = () => {
    const navigate = useNavigate()


    return (
        <NewLayout>
            <div style={{display: "grid", gridTemplateColumns: "repeat(11, 1fr)"}}>
                <div style={{gridRow: "2", gridColumn: "1/11", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", alignItems: "center", margin: "0 0 10px 0"}}>
                    <div style={{gridColumn: "2", gridRow: "3", padding: "10px", backgroundColor: "#7864f4", marginRight: "1em"}}>TVL: $ 192.168.000.000</div>
                    <div style={{gridColumn: "3", gridRow: "3", padding: "10px", backgroundColor: "#7864f4", marginRight: "1em"}}>VOLUME: $ 1.000.000</div>
                    <div style={{gridColumn: "4", gridRow: "3"}}>
                        <Button content="Create pool" handler={() => {navigate("/liquidity")}} />
                    </div>
                </div>
                <CardContainer gridRow="3" gridColumn="1/11" cardTitle="Liquidity Pools" width="85%">
                    <PoolModule />
                </CardContainer >
            </div>
        </NewLayout>
    )
}