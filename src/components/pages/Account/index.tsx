import React from 'react';
import Layout from "../../../layout";
import {useDeviceType} from "rengo-ui-kit";
import { AccountTemplate } from '../../templates/AccountTemplate';

export const Account = () => {
    const deviceType = useDeviceType()
    const isMobile = deviceType === 'mobile'

    return (
        <Layout>
            <AccountTemplate isMobile={isMobile}/>
        </Layout>
    );
}
