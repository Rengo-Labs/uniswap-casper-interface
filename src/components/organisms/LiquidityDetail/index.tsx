import React from 'react';
import {LiquidityDetails} from 'rengo-ui-kit';
const LiquidityDetail = () => {
    // TODO we need to get all the information and connect with the components

    const firstTokenSelected = {
        amount: '2000',
        allowance: '',
        symbolPair: 'USDT',
        chainId: 2,
        contractHash: '0x123456789',
        decimals: 9,
        logoURI: '',
        name: 'USDT',
        packageHash: '0x123456789',
        symbol: 'USDT',
        priceUSD: '33',
    }

    const secondTokenSelected = {
        amount: '3000',
        allowance: '',
        symbolPair: 'CST',
        chainId: 1,
        contractHash: '0x123456789',
        decimals: 9,
        logoURI: '',
        name: 'CST',
        packageHash: '0x123456789',
        symbol: 'CST',
        priceUSD: '33',
    }
    return (
        <>
            <LiquidityDetails
                firstSelectedToken={firstTokenSelected}
                secondSelectedToken={secondTokenSelected}
                gasFee={0.33}
                slippageTolerance={0.22} />
        </>
    )
}

export default LiquidityDetail
