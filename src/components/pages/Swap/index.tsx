import React, {useEffect} from 'react';
import Layout from '../../../layout';
import {SwapTemplate} from "../../templates";
import {useDeviceType} from "rengo-ui-kit";
import {useLoader} from "../../../hooks/useLoader";
export const Swap = () => {
    const deviceType = useDeviceType()
    const isMobile = deviceType === 'mobile'
    const {setLoader}  = useLoader();

    useEffect(() => {
        setLoader(1000, true)
    }, [])

    return (
        <Layout>
            <SwapTemplate isMobile={isMobile}/>
        </Layout>
    )
};
