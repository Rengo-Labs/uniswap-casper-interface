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
    HeaderPool,
    TitleBoxWrapper
} from "./styles";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";
import {POCSearch3} from "../../POCSearch3";

export const Pools = () => {
    const navigate = useNavigate()
    const { 
        poolColumns,
        gralData, 
        getPoolList,
        tableInstance,
        setCurrentQuery,
        currentQuery
    } = React.useContext(ConfigProviderContext)

    return (
        <NewLayout title="CASPERSWAP">
            <WrappedPool>
                <WrappedHeaderPool>
                    <HeaderPool>Liquidity Pools</HeaderPool>
                    <WrappedPoolTitle>
                        {
                            tableInstance &&
                            <POCSearch3 tableInstance={tableInstance} setQuery={setCurrentQuery} />
                        }

                        <TitleBoxWrapper><TitleBox>TVL: $ {gralData.tvl}</TitleBox></TitleBoxWrapper>
                        <TitleBoxWrapper><TitleBox>VOLUME: $ {gralData.totalVolume}</TitleBox></TitleBoxWrapper>
                    </WrappedPoolTitle>
                </WrappedHeaderPool>
                <CardContainer gridRow="2" gridColumn="1/11" cardTitle="Liquidity Pools" width="85%">
                    <PoolModule columns={poolColumns} data={getPoolList()} />
                </CardContainer >
            </WrappedPool>
        </NewLayout>
    )
}