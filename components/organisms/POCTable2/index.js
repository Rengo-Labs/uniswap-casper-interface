import React from 'react'

import { POCTHead2, POCTBody2 } from '../../molecules'
import { POCTableStyled } from './styles'
export const POCTable2 = ({ getTableProps, headerGroups, getTableBodyProps, rows, prepareRow }) => {
    return (
        <POCTableStyled {...getTableProps()}>
            <POCTHead2 headerGroups={headerGroups} />
            <POCTBody2 getTableBodyProps={getTableBodyProps} rows={rows} prepareRow={prepareRow} />
        </POCTableStyled>
    )
}
