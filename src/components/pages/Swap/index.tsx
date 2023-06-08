import React from 'react';
import Layout from '../../../layout';
import {SwapTemplate} from "../../templates";
import {useDeviceType} from "rengo-ui-kit";

export const Swap = () => {
    const deviceType = useDeviceType()
    const isMobile = deviceType === 'mobile'

    return (
        <Layout>
            <SwapTemplate isMobile={isMobile}/>
        </Layout>
    )
};
