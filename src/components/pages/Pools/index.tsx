import React, {useEffect, useState} from 'react'

import {Button, CardContainer} from '../../atoms'
import { PoolModule } from '../../organisms'

import {useNavigate} from "react-router-dom";
import NewLayout from "../../../layout/NewLayout";
import {PoolsProviderContext} from "../../../contexts/PoolsContext";
import {WrappedPool, WrappedPoolTitle} from "./styles";
import {lightTheme} from "../../../contexts/ThemeContext/themes";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";

const TitleBox = ({label, content}) => {
    return <div style={{flex: "2", padding: "10px 10px 10px 20px", backgroundColor: lightTheme.secondBackgroundColor, marginRight: "1vw", fontSize: "1vw",
        height: "3vh", display: "flex", alignItems: "center"}}>{label} {content}</div>
}

export const Pools = () => {
    const navigate = useNavigate()
    const { poolColumns, gralData, poolList, setPoolList, getPoolList, getTVLandVolume } = React.useContext(ConfigProviderContext)
    const [rows, setRows] = useState(poolList)

    useEffect(() => {
        const result = async () => {
            await getTVLandVolume()

            const result = await getPoolList()

            setPoolList(result)
            //setRows(result)
        }

        result().catch(console.error)
    }, [])

    return (
        <NewLayout title="">
            <WrappedPool>
                <WrappedPoolTitle>
                    <div style={{flex: "1"}} />
                    <TitleBox label="TVL: $" content={gralData.tvl} />
                    <TitleBox label="VOLUME: $" content={gralData.totalVolume} />
                    <Button style={{flex: "1"}} content="Create pool" handler={() => {navigate("/liquidity")}} />
                    <div style={{flex: "6"}} />
                </WrappedPoolTitle>
                <CardContainer gridRow="3" gridColumn="1/11" cardTitle="Liquidity Pools" width="85%">
                    <PoolModule columns={poolColumns} data={poolList} />
                </CardContainer >
            </WrappedPool>
        </NewLayout>
    )
}