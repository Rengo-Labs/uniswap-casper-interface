import React from 'react'

import { TableDataStyled } from './styles'
import { Link } from 'react-router-dom'

export const TokenTableData = ({ name, price, change, priceChart, volume24h, marketCap, supply, symbol }:any) => {

    return (
        <>
            <TableDataStyled>{name}</TableDataStyled>
            <TableDataStyled>{price}</TableDataStyled>
            <TableDataStyled>{change}</TableDataStyled>
            <TableDataStyled>{priceChart}</TableDataStyled>
            <TableDataStyled>{volume24h}</TableDataStyled>
            <TableDataStyled>{marketCap}</TableDataStyled>
            <TableDataStyled>{supply}</TableDataStyled>
            <TableDataStyled>
                <Link to="/swap">
                    <button>{symbol}</button>
                </Link>

            </TableDataStyled>
        </>
    )
}
