import React from 'react';
import Layout from "../../../layout";
import {LiquidityTemplate} from "../../templates";
import {useDeviceType} from "rengo-ui-kit";
export const Liquidity = () => {
    const deviceType = useDeviceType()
    const isMobile = deviceType === 'mobile'
    return (
        <Layout>
            <LiquidityTemplate isMobile={isMobile}/>
        </Layout>
    );
}
