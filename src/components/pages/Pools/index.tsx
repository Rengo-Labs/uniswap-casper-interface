import React, {useEffect} from 'react'

import {Button, CardContainer} from '../../atoms'
import { PoolModule } from '../../organisms'

import {useNavigate} from "react-router-dom";
import NewLayout from "../../../layout/NewLayout";
import {WrappedPool, WrappedPoolTitle} from "./styles";
import {lightTheme} from "../../../contexts/ThemeContext/themes";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";

const TitleBox = ({label, content}) => {
    return <div style={{flex: "2.9", padding: "10px 10px 10px 20px", backgroundColor: lightTheme.secondBackgroundColor, marginRight: "1vw", fontSize: "1vw",
        height: "3vh", display: "flex", alignItems: "center"}}>{label} {content}</div>
}

export const Pools = () => {
    const navigate = useNavigate()
    const { poolColumns, gralData, poolList, setPoolList, getPoolList, getTVLandVolume, loadPoolDetailByUser, isConnected, getAccountHash } = React.useContext(ConfigProviderContext)

    useEffect(() => {
        const result = async () => {
            await getTVLandVolume()
            
            const result = await getPoolList()
            if (isConnected) {
                const newList = await loadPoolDetailByUser("4a2d7b35723a70c69e0f4c01df65df9bf8dced1d1542f11426aed570bcf2cbab", result)
                setPoolList(newList)
                console.log('pools a', newList)
            } else {
                setPoolList(result)
            }
        }

        result().catch(console.error)
    }, [isConnected])

    return (
        <NewLayout title="CASPERSWAP">
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