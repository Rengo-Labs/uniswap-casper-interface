import React from 'react'

import { TableDataStyled } from './styles'
import Link from 'next/link'

export const TokenTableData = ({ name, price, change, priceChart, volume24h, marketCap, supply, symbol }) => {

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
                <Link
                    href={
                        {
                            pathname: '/swap',
                            query: { tokenOne: `${symbol}` },
                        }
                    }
                >
                    <button>{symbol}</button>
                </Link>

            </TableDataStyled>
        </>
    )
}
