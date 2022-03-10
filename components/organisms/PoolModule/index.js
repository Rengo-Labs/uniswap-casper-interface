import React from 'react'

import { PoolModulesStyled } from './styles'
import { PoolSearch, PoolTable, PoolTData, PoolTHead } from '../../molecules'
import { TRow } from '../../atoms'
export const PoolModule = () => {
    const headers = ["Name","Liquidity","Volume","Volume","Fees","1y Fees/Liquidity"]
    const bytes = {name:"ABC-DFG",liquidity:"$78,438,726.23",volume24h:"$11,455,104.61",volume7d:"79,393.76",fees24h:"$28,637.76",anualFeesLiquidity:"13.19%"}
    const data = [1,2,3,4,5,6].map(x => bytes)
    return (
        <PoolModulesStyled>
            <PoolSearch />
            <PoolTable>
                <PoolTHead headers={headers} />
                {data.map(info => <TRow><PoolTData {...info}/></TRow>)}
            </PoolTable>
        </PoolModulesStyled>
    )
}
