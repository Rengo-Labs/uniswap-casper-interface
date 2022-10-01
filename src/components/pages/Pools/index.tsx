import React from 'react'

import {Button, CardContainer} from '../../atoms'
import { PoolModule } from '../../organisms'

import {useNavigate} from "react-router-dom";
import NewLayout from "../../../layout/NewLayout";
import {PoolsProviderContext} from "../../../contexts/PoolsContext";
import {WrappedPool, WrappedPoolTitle} from "./styles";
import {lightTheme} from "../../../contexts/ThemeContext/themes";

const TitleBox = ({column, row, label, content}) => {
    return <div style={{gridColumn: column, gridRow: row, padding: "10px 10px 10px 20px", backgroundColor: lightTheme.secondBackgroundColor, marginRight: "1em"}}>{label} {content}</div>
}

export const Pools = () => {
    const navigate = useNavigate()
    const { gralData } = React.useContext(PoolsProviderContext)

    return (
        <NewLayout title="CASPERSWAP">
            <WrappedPool>
                <WrappedPoolTitle>
                    <TitleBox column="2/4" row="3" label="TVL: $" content={gralData.tvl} />
                    <TitleBox column="4/6" row="3" label="VOLUME: $" content={gralData.totalVolume} />
                    <Button style={{gridColumn: "6/7", gridRow: "3"}} content="Create pool" handler={() => {navigate("/liquidity")}} />
                </WrappedPoolTitle>
                <CardContainer gridRow="3" gridColumn="1/11" cardTitle="Liquidity Pools" width="85%">
                    <PoolModule />
                </CardContainer >
            </WrappedPool>
        </NewLayout>
    )
}