import React from 'react'

import { POCTHead, POCTBody } from '../../molecules'
import { POCTableStyled } from './styles'
export const POCTable = ({ getTableProps, headerGroups, getTableBodyProps, rows, prepareRow }) => {
    return (
        <POCTableStyled {...getTableProps()}>
            <POCTHead headerGroups={headerGroups} />
            <POCTBody getTableBodyProps={getTableBodyProps} rows={rows} prepareRow={prepareRow} />
        </POCTableStyled>
    )
}
