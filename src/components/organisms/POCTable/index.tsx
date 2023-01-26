import React from 'react'
import { TableInstance } from 'react-table'

import { POCTHead, POCTBody } from '../../molecules'
import { POCTableStyled } from './styles'

export const POCTable = ({ 
    getTableProps, 
    headerGroups, 
    getTableBodyProps, 
    rows, 
    prepareRow,
}: TableInstance<any>) => {
    return (
        <POCTableStyled {...getTableProps()}>
            <POCTHead headerGroups={headerGroups} />
            <POCTBody getTableBodyProps={getTableBodyProps} rows={rows} prepareRow={prepareRow} />
        </POCTableStyled>
    )
}
