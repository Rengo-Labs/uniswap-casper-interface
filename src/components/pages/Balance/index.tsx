import React from 'react';
import Layout from "../../../layout";
import {BalanceTemplate} from "../../templates";
import {useDeviceType} from "rengo-ui-kit";
export const Balance = () => {
    const deviceType = useDeviceType()
    const isMobile = deviceType === 'mobile'

    return (
        <Layout>
            <BalanceTemplate isMobile={isMobile}/>
        </Layout>
    );
}
