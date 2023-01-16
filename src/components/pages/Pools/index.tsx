import React from 'react'

import {CardContainer} from '../../atoms'
import { PoolModule } from '../../organisms'

import {useNavigate} from "react-router-dom";
import NewLayout from "../../../layout/NewLayout";
import {
    WrappedPool,
    WrappedPoolTitle,
    TitleBox,
    CreatePoolButton,
    WrappedHeaderPool,
    HeaderPool
} from "./styles";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";
import {POCSearch3} from "../../POCSearch3";

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
                <WrappedHeaderPool>
                    <HeaderPool>Liquidity Pools</HeaderPool>
                    <WrappedPoolTitle>
                        <POCSearch3 columns={poolColumns} data={getPoolList()}/>
                        <TitleBox>TVL: $ {gralData.tvl}</TitleBox>
                        <TitleBox>VOLUME: $ {gralData.totalVolume}</TitleBox>
                        <CreatePoolButton enabled={true} onClick={() => {navigate("/liquidity")}} >Create pool</CreatePoolButton>
                    </WrappedPoolTitle>
                </WrappedHeaderPool>
                <CardContainer gridRow="2" gridColumn="1/11" cardTitle="Liquidity Pools" width="85%">
                    <PoolModule columns={poolColumns}
                                data={getPoolList()}
                    />
                </CardContainer >
            </WrappedPool>
        </NewLayout>
    )
}