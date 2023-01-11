import React from 'react'

import {Button, CardContainer} from '../../atoms'
import { PoolModule } from '../../organisms'

import {useNavigate} from "react-router-dom";
import NewLayout from "../../../layout/NewLayout";
import {WrappedPool, WrappedPoolTitle, TitleBox, Column6, Column1} from "./styles";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";

export const Pools = () => {
    const navigate = useNavigate()
    const { 
        poolColumns, 
        gralData, 
        getPoolList, 
    } = React.useContext(ConfigProviderContext)

    return (
        <NewLayout title="CASPERSWAP">
            <WrappedPool>
                <WrappedPoolTitle>
                    <Column1/>
                    <TitleBox>TVL: $ {gralData.tvl}</TitleBox>
                    <TitleBox>VOLUME: $ {gralData.totalVolume}</TitleBox>
                    {/* TODO: remove inline css*/}
                    <Button style={{flex: "1", height: "2.8rem"}} content="Create pool" handler={() => {navigate("/liquidity")}} />
                    <Column6/>
                </WrappedPoolTitle>
                <CardContainer gridRow="3" gridColumn="1/11" cardTitle="Liquidity Pools" width="85%">
                    <PoolModule columns={poolColumns} data={getPoolList()} />
                </CardContainer >
            </WrappedPool>
        </NewLayout>
    )
}