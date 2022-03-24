import React from 'react'

import { TableDataStyled, TableContainerStyled } from './styles'

export const PoolTableData = ({ icon, name, liquidity, volume24h, volume7dh, fees24h, oneYFees }) => {
    const widtHeight = 25
    return (
        <>
            <TableDataStyled>
                <img src={icon.src} width={widtHeight} height={widtHeight} /><p>{name}</p>
            </TableDataStyled>
            <TableDataStyled>{liquidity}</TableDataStyled>
            <TableDataStyled>{volume24h}</TableDataStyled>
            <TableDataStyled>{volume7dh}</TableDataStyled>
            <TableDataStyled>{fees24h}</TableDataStyled>
            <TableDataStyled>{oneYFees}</TableDataStyled>
        </>
    )
}
