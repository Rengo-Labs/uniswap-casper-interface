import React from 'react'

import { PoolModulesStyled } from './styles'
import { TokenSearch, PoolTable, PoolTData, PoolTHead } from '../../molecules'
import { TRow } from '../../atoms'
export const TokensModule = () => {
    const headers = ["Name", "Price", "Change", "Price Chart", "Volume (24h)", "Market cap", "Supply", "Trade"]
    const byte = {
        name: "ABC-DFG",
        price: "$78,438,726.23",
        change: "+4.89%",
        priceChart: "[WIP]",
        volume24h: "$21.88",
        marketCap: "$835.88",
        supply: "19M",
        symbol: "CSPR",
    }
    const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(x => byte)
    return (
        <PoolModulesStyled>
            <TokenSearch />
            <PoolTable headers={headers} data={data} />
        </PoolModulesStyled>
    )
}
