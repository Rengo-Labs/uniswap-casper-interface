import React from 'react';
import {SwapTabs} from 'rengo-ui-kit';

const SwapDetail = (firstTokenImg, secondTokenImg, firstSelectedToken, gasFee, secondSelectedToken, slippageTolerance) => {
    // TODO we need to get all the information and connect with the components
    return (
        <>
            <SwapTabs
                firstTokenImg={firstTokenImg}
                secondTokenImg={secondTokenImg}
                firstSelectedToken={firstSelectedToken}
                gasFee={gasFee}
                secondSelectedToken={secondSelectedToken}
                slippageTolerance={slippageTolerance}
            />
        </>
    )
}

export default SwapDetail
