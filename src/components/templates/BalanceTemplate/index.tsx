import React from 'react';
import {SingleColumn} from "../../../layout/SingleColumn";
import {BalanceTable} from "rengo-ui-kit";

export const BalanceTemplate = ({isMobile}) => {
    const data = [
        {
            id: 1,
            crypto: 'BTC',
            cryptoIcon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
            mycrypto: 0.00000000,
            '24h': '0.00%',
            '7d': '0.00%',
            '15d': '0.00%',
            '30d': '0.00%'
        },
        {
            id: 2,
            crypto: 'ETH',
            cryptoIcon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
            mycrypto: 0.00000000,
            '24h': '0.00%',
            '7d': '0.00%',
            '15d': '0.00%',
            '30d': '0.00%'
        }
    ]
    return (
        <div>
            <SingleColumn isMobile={isMobile} title="My Balance">
                <BalanceTable data={data}/>
            </SingleColumn>
        </div>
    );
}
